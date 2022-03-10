const express = require("express");
const utils = require("../utils/utils.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const UsersModel = require("../models/UsersModels.js");
const SettingsModel = require("../models/SettingsModels.js");
const MoviesModel = require("../models/MoviesModels.js");
const ReviewsModel = require("../models/ReviewsModels.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await UsersModel.find().lean();

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWT_SECRET)) {
    res.render("profiles/profiles-list", { users });
  } else {
    res.render("notFound.hbs");
  }
});

router.get("/:id", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();
  const settings = await SettingsModel.find({
    settingsBy: req.params.id,
  }).lean();
  const reviews = await ReviewsModel.find({ reviewedBy: req.params.id })
    .populate("reviewedTitle")
    .populate("reviewedBy")
    .lean();

  res.render("profiles/profiles-single", { user, settings, reviews });
});

router.get("/edit-profile/:id", async (req, res) => {
  const user = await UsersModel.findById(req.params.id)
    .populate("settings")
    .lean();

  console.log("USER\n", user.settings);
  res.render("profiles/profiles-edit", { user });
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

module.exports = router;
