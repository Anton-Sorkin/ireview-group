const express = require("express");
const utils = require("../utils/utils.js");
const UsersModel = require("../models/UsersModels.js");
const EditsModel = require("../models/EditsModels");
const jwt = require("jsonwebtoken");

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
  const settings = await EditsModel.find().lean();
  res.render("profiles/single-copy", { user, settings });
});

router.get("/edit-profile/:id", async (req, res) => {
  const settings = await EditsModel.find().populate("settingsBy").lean();

  const user = await UsersModel.findById(req.params.id).lean();
  res.render("profiles/edit-profiles", { user, settings });
  console.log(settings);
});

router.post("/edit-profile/:id", async (req, res) => {
  const { favmovie, quote, quoteby, settingsBy } = req.body;

  EditsModel.findOne({ favmovie }, async () => {
    const newEdit = new EditsModel({
      favmovie,
      quote,
      quoteby,
      settingsBy,
    });

    await newEdit.save();

    res.redirect("/");
  });
});

module.exports = router;
