// Create a separate file, e.g., movie-type.js
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLID
  } = require('graphql');
  
  
  const MovieType = new GraphQLObjectType({
    name: 'MovieType',
    fields: () => ({
      id: { type: GraphQLID },
      title: { type: new GraphQLNonNull(GraphQLString) },
      genre: { type: GraphQLString },
      director: { type: GraphQLString },
      releaseYear: { type: GraphQLInt },
      rating: { type: GraphQLInt }
    })
  });
  
  module.exports = MovieType;