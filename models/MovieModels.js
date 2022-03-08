const { Schema, model } = require("mongoose");

const movieSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	genre: { type: String, required: true },
	img: { type: String, required: true },
	reviewedByUser: { type: Schema.Types.ObjectId, ref: "Users", required: true },
});

const MovieModel = model("Movies", movieSchema);

module.exports = MovieModel;
