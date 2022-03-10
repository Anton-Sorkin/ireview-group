const express = require("express");
const utils = require("../utils/utils.js");
const UsersModel = require("../models/UsersModels.js");
const ReviewsModel = require("../models/ReviewsModels.js");
const SettingsModel = require("../models/SettingsModels.js");

const router = express.Router();

router.get("/", (req, res) => {
	res.render("register/register-user");
});

router.post("/", async (req, res) => {
	const { username, password, confirmPassword, role, secret, reviews } =
		req.body;

	UsersModel.findOne({ username }, async (err, user) => {
		if (user) {
			res.send("Username already exist!");
		} else if (password !== confirmPassword) {
			res.send("Passwords don't match!");
		} else {
			const newSetting = new SettingsModel({
				favmovie: "",
				quote: "",
				quoteby: "",
			});
			const newSettingsResult = await newSetting.save();

			const newUser = new UsersModel({
				username,
				hashedPassword: utils.hashPassword(password),
				role,
				secret,
				reviews,
				settings: newSettingsResult._id,
			});

			await newUser.save();

			res.redirect("/main");
		}
	});
});

module.exports = router;
