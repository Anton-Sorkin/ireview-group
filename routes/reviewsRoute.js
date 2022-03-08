const express = require("express");
const utils = require("../utils/utils.js");
const UsersModel = require("../models/UsersModels.js");
const ReviewsModel = require("../models/ReviewsModels.js");
const MovieModel = require("../models/MovieModels.js");

const router = express.Router();

router.get("/", async (req, res) => {
	const movies = await MovieModel.find().lean();
	const users = await UsersModel.find().lean();
	res.render("reviews/write-review", { movies, users });
});

router.get("/list", async (req, res) => {
	const reviews = await ReviewsModel.find().lean();
	const users = await UsersModel.find().populate("reviews").lean();
	res.render("reviews/reviews-list", { reviews, users });
});

router.post("/write-review", async (req, res) => {
	// const user = await UsersModel.findById();
	const newReview = new ReviewsModel({
		review: req.body.review,
		rating: req.body.rating,
		reviewedBy: req.body.reviewedBy,
	});

	await newReview.save();
	res.redirect("/reviews/list");
});

module.exports = router;
