const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  userId: String,
  comment: String,
  timestamp: Date
});

const MovieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  cast: {
    type: String,
    required: true
  },
  directors: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  runtime: {
    type: String,
    required: true
  },
  reviews: {
    type: [reviewSchema],
  }
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
