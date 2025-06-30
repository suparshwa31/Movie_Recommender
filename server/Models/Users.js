const mongoose = require('mongoose');

// Define the Movie Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mail_id: {
    type: String,
    required: true
  },
  // DOB: {
  //   type: Date,
  //   required: false
  // },
  password: {
    type: String,
    required: true
  }
});

// Create and export the Movie model
const Movie = mongoose.model('Users', UserSchema);
module.exports = Movie;
