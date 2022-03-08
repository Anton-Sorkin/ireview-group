const express = require("express");
const utils = require("../utils/utils.js");
const UsersModel = require("../models/UsersModels.js");
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
  res.render("profiles/single-copy", { user });
});

// router.get("/edit-profile", (req, res) => {
// 	res.render("profiles/edit-profiles");
// });

router.get("/edit-profile/:id", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();
  res.render("profiles/edit-profiles", { user });
});

module.exports = router;
