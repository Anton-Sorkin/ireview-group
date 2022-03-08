const express = require("express");
const utils = require("../utils/utils.js");
const UsersModel = require("../models/UsersModels.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("profiles/profiles-single");
});

router.get("/:id", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();
  res.render("profiles/single-copy", { user });
});

module.exports = router;
