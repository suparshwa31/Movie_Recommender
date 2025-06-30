const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const Movie = require('../Models/Movie');
const users = require('../Models/Users');
const MovieType = require('./MovieDetails');
const UserType = require('./UserDetails');
const { recommendedMovies } = require('./Recommended_Movies');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    recommendedMovies: {
      type: new GraphQLList(MovieType), // Returns an array of MovieType
      args: { movieName: { type: GraphQLString } }, // Accepts a 'movieName' argument
      resolve(parent, args) {
        return recommendedMovies(args.movieName); // Call your recommendation model with the movieName
      }
    },

    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movie.findById(args.id);
      }
    },

    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movie.find({});
      }
    },

    user: {
      type: UserType,
      args: { name: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await users.findOne({ name: args.name });
      }      
    },

    users: {
      type: UserType,
      resolve (parent, args) {
        return users;
      }
    }
  }
});

module.exports = RootQuery;