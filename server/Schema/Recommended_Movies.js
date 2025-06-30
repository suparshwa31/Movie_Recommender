const axios = require("axios");
const { GraphQLList, GraphQLInt } = require("graphql");
const MovieType = require("./MovieDetails");

const recommendedMovies = {
  type: new GraphQLList(MovieType),
  args: {
    limit: { type: GraphQLInt }
  },
  resolve: async (_, { limit = 10 }) => {
    try {
      const response = await axios.get(`http://localhost:5001/recommendations?limit=${limit}`);
      const data = response.data;

      return data.map(movie => ({
        id: movie.id.toString(),
        title: movie.original_title,
        rating: movie.vote_average,
        genre: null,
        director: null,
        releaseYear: null,
      }));
    } catch (error) {
      throw new Error("Failed to fetch recommendations: " + error.message);
    }
  }
};

module.exports = {
  recommendedMovies,
};
