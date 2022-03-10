const express = require("express");
const UsersModel = require("../models/UsersModels.js");
const EditsModel = require("../models/EditsModels");
const jwt = require("jsonwebtoken");
const PictureModel = require("../models/PictureModels.js");
const { getUniqueFilename } = require("../utils/utils");
const utils = require("../utils/utils");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await UsersModel.find().lean();
  const pic = await PictureModel.find().lean();

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWT_SECRET)) {
    res.render("profiles/profiles-list", { users, pic });
  } else {
    res.render("notFound.hbs");
  }
});

router.get("/:id", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();
  const settings = await EditsModel.find({ settingsBy: req.params.id }).lean();
  const pic = await PictureModel.find({ picBy: req.params.id }).lean();
  res.render("profiles/single-copy", { user, settings, pic });
  console.log(settings);
});

router.get("/edit-profile/:id", async (req, res) => {
  const settings = await EditsModel.find().populate("settingsBy").lean();
  const pic = await PictureModel.find().populate("picBy").lean();

  const user = await UsersModel.findById(req.params.id).lean();
  res.render("profiles/edit-profiles", { user, settings, pic });
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

    res.redirect("/main");
  });
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
