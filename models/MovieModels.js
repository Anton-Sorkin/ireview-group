const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  img: { type: String, required: true },
});

const MovieModel = mongoose.model("Movies", movieSchema);

module.exports = MovieModel;
