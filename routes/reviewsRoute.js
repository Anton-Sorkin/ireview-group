const express = require("express");
const utils = require("../utils/utils.js");
const UsersModel = require("../models/UsersModels.js");
const ReviewsModel = require("../models/ReviewsModels.js");
const MovieModel = require("../models/MovieModels.js");

const router = express.Router();

router.get("/", async (req, res) => {
	const movies = await MovieModel.find().lean();
	const users = await UsersModel.find().lean();
	res.render("reviews/reviews-list", { movies, users });
});

router.get("/write-review", async (req, res) => {
	const movies = await MovieModel.find().lean();
	const users = await UsersModel.find().lean();
	res.render("reviews/write-review", { movies, users });
});

router.post("/write-review", async (req, res) => {
	const newReview = new ReviewsModel({
		review: req.body.review,
		rating: req.body.rating,
		reviewedBy: req.body.reviewedBy,
		reviewedTitle: req.body.reviewedTitle,
	});

	await newReview.save();
	res.redirect("/reviews/list");
});

router.get("/:id", async (req, res) => {
	const reviews = await ReviewsModel.find()
		.populate("reviewedBy", "reviewedTitle")
		.lean();

	const movie = await MovieModel.findById(req.params.id).lean();
	const users = await UsersModel.find().lean();

	res.render("reviews/reviews-single", {
		reviews,
		users,
		movie,
	});
});

// router.get("/:id", async (req, res) => {
// 	const review = await ReviewsModel.findById(req.params.id)
// 		.populate("reviewedBy")
// 		.lean();

// 	res.render("reviews/reviews-single", review);
// });

module.exports = router;
