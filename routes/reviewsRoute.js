const express = require("express");
const utils = require("../utils/utils.js");

const UsersModel = require("../models/UsersModels.js");
const ReviewsModel = require("../models/ReviewsModels.js");
const MoviesModel = require("../models/MoviesModels.js");

const router = express.Router();

router.get("/", async (req, res) => {
	const movies = await MoviesModel.find().lean();
	const users = await UsersModel.find().lean();
	res.render("reviews/reviews-list", { movies, users });
});

router.get("/write-review", async (req, res) => {
	const movies = await MoviesModel.find().lean();
	const users = await UsersModel.find().lean();
	// const reviews = await ReviewsModel.find().lean();

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
	res.redirect("/reviews");
});

router.get("/:id", async (req, res) => {
	const reviews = await ReviewsModel.find({ reviewedTitle: req.params.id })
		.populate("reviewedTitle")
		.populate("reviewedBy")
		.lean();

	const movie = await MoviesModel.findById(req.params.id).lean();
	const users = await UsersModel.findById(req.params.id).lean();
	res.render("reviews/reviews-single", {
		reviews,
		movie,
		users,
	});
});

router.get("/user-review/:id", async (req, res) => {
	const review = await ReviewsModel.findById(req.params.id).lean();

	console.log(review);

	res.render("reviews/reviews-user", { review });
});

module.exports = router;
