const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
	review: { type: String, required: true },
	rating: { type: Number, required: true },
	reviewedBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
});

const ReviewsModel = model("Reviews", reviewSchema);

module.exports = ReviewsModel;
