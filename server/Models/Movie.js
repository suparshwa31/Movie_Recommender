const mongoose = require('mongoose');

// Define the Movie Schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  description: {
    type: String,
  },
  director: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0
  }
});

// Create and export the Movie model
const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
