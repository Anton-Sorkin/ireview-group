const express = require("express");
const utils = require("../utils/utils.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const UsersModel = require("../models/UsersModels.js");
const SettingsModel = require("../models/SettingsModels.js");
const MoviesModel = require("../models/MoviesModels.js");
const ReviewsModel = require("../models/ReviewsModels.js");
const PictureModel = require("../models/PictureModels");
const { getUniqueFilename } = require("../utils/utils");
const router = express.Router();

router.get("/", async (req, res) => {
	const users = await UsersModel.find().lean();

	res.render("profiles/profiles-list", { users });
});

router.get("/:id", async (req, res) => {
	const user = await UsersModel.findById(req.params.id)
		.populate("settings")
		.lean();

	const reviews = await ReviewsModel.find({ reviewedBy: req.params.id })
		.populate("reviewedTitle")
		.populate("reviewedBy")
		.lean();
	const pic = await PictureModel.find({ picBy: req.params.id }).lean();

	res.render("profiles/profiles-single", { user, reviews, pic });
});

router.get("/edit-profile/:id", async (req, res) => {
	const user = await UsersModel.findById(req.params.id)
		.populate("settings")
		.lean();
	const pic = await PictureModel.find().populate("picBy").lean();

	console.log("USER\n", user.settings);
	res.render("profiles/profiles-edit", { user, pic });
});

router.post("/edit-profile/:id/:userId", async (req, res) => {
	const { favmovie, quote, quoteby } = req.body;

	SettingsModel.findByIdAndUpdate(
		req.params.id,
		{
			favmovie,
			quote,
			quoteby,
		},
		(error, docs, result) => {
			if (error) res.status(500).redirect("/profiles");
			else {
				res.status(200).redirect("/profiles/" + req.params.userId);
			}
		}
	);
});

router.post("/edit-profile-pic/:id", async (req, res) => {
	const image = req.files.image;
	const picBy = req.body.picBy;

	const filename = getUniqueFilename(image.name);
	const uploadPath = __dirname + "/../public/img/" + filename;

	await image.mv(uploadPath);

	const picture = new PictureModel({
		name: req.body.name,
		imageUrl: "/img/" + filename,
		picBy,
	});

	await picture.save();

	res.redirect("/profiles");
});

module.exports = router;
