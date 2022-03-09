const express = require("express");
const utils = require("../utils/utils.js");
const UsersModel = require("../models/UsersModels.js");
const MoviesModel = require("../models/MovieModels.js");
const ReviewsModel = require("../models/ReviewsModels.js");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", async (req, res) => {
	const users = await UsersModel.find().lean();
	const movies = await MoviesModel.findOne({ title: "Die Hard" }).lean();

	const { token } = req.cookies;

	if (token && jwt.verify(token, process.env.JWT_SECRET)) {
		res.render("movies/movies-main", { users, movies });
	} else {
		res.redirect("/");
	}
	console.log(movies);
});

router.get("/log-out-user", (req, res) => {
	res.cookie("token", "", { maxAge: 0 });
	res.redirect("/");
});

module.exports = router;
