const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID
} = require('graphql');
const Movie = require('../Models/Movie');
const User = require('../Models/Users'); 
const MovieType = require('./MovieDetails');
const UserType = require('./UserDetails');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

// Create AuthPayload type for login response
const AuthPayloadType = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: () => ({
    token: { type: GraphQLString },
    user: { type: UserType }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMovie: {
      type: MovieType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        releaseYear: { type: new GraphQLNonNull(GraphQLInt) },
        director: { type: GraphQLString },
        rating: { type: GraphQLInt }
      },
      resolve(parent, args) {
        const movie = new Movie({
          title: args.title,
          genre: args.genre,
          releaseYear: args.releaseYear,
          director: args.director || '',
          rating: args.rating || 0
        });
        return movie.save();
      }
    },
    

    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        mail_id: { type: new GraphQLNonNull(GraphQLString) },
        // DOB: { type: new GraphQLString },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(args.password, 10); //hasing the password for privacy
        
        // Convert the DOB string to a proper Date object
        // const dateObj = new Date(args.DOB);
        
        const user = new User({
          name: args.name,
          mail_id: args.mail_id,
          // DOB: dateObj, // Pass a proper Date object instead of a string
          password: hashedPassword,
        });
        
        return user.save();
      }
    },

    login: {
      type: AuthPayloadType,
      args: {
        mail_id: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        
        const user = await User.findOne({ mail_id: args.mail_id });
        
        if (!user) {
          throw new Error('User not found');
        }
        
        
        const validPassword = await bcrypt.compare(args.password, user.password);
        
        if (!validPassword) {
          throw new Error('Invalid password');
        }
        
        // Create and sign JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.mail_id },
          process.env.JWT_SECRET || 'your-secret-key', // Use environment variable in production
          { expiresIn: '24h' }
        );
        
        return {
          token,
          user
        };
      }
    }
  }
});

module.exports = Mutation;