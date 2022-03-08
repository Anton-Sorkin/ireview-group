const express = require("express");
const utils = require("../utils/utils.js");
const UsersModel = require("../models/UsersModels.js");
const ReviewsModel = require("../models/ReviewsModels.js");
const MovieModel = require("../models/MovieModels.js");

const router = express.Router();

router.get("/", async (req, res) => {
	const movies = await MovieModel.find().lean();
	res.render("reviews/write-review", { movies });
});

// router.post("/", async (req, res) => {
// 	const { username, password, confirmPassword, role, secret } = req.body;

// 	UsersModel.findOne({ username }, async (err, user) => {
// 		if (user) {
// 			res.send("Username already exist!");
// 		} else if (password !== confirmPassword) {
// 			res.send("Passwords don't match!");
// 		} else {
// 			const newUser = new UsersModel({
// 				username,
// 				hashedPassword: utils.hashPassword(password),
// 				role,
// 				secret,
// 			});

// 			await newUser.save();

// 			res.redirect("/main");
// 		}
// 	});
// });

module.exports = router;
