//REQUIREMENTS
const express = require("express");
const UsersModel = require("../models/UsersModels.js");
const MovieModel = require("../models/MovieModels");
const jwt = require("jsonwebtoken");
const ReviewsModel = require("../models/ReviewsModels.js");
const { adminAuth } = require("../utils/utils.js");
const router = express.Router();

//GETS
router.get("/", adminAuth, async (req, res) => {
  const user = await UsersModel.findById();

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWT_SECRET)) {
    res.render("admins/admin", { user });
  } else {
    res.send("not good");
  }
});

router.get("/users", adminAuth, async (req, res) => {
  const users = await UsersModel.find().lean();

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWT_SECRET)) {
    res.render("admins/adminUsers", { users });
  } else {
    res.render("notFound.hbs");
  }
});

router.get("/reviews", adminAuth, async (req, res) => {
  const reviews = await ReviewsModel.find().lean();

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWT_SECRET)) {
    res.render("admins/adminReviews", { reviews });
  } else {
    res.render("notFound.hbs");
  }
});

//POSTS
router.post("/", async (req, res) => {
  const { title, description, genre, img } = req.body;

  MovieModel.findOne({ title }, async () => {
    const newMovie = new MovieModel({
      title,
      description,
      genre,
      img,
    });

    await newMovie.save();

    res.redirect("/admin"); //ändra till filmen när den e skapad
  });
});

router.post("/users/:id", async (req, res) => {
  await UsersModel.findByIdAndDelete(req.params.id);

  res.redirect("/admin/users");
});

router.post("/reviews/:id", async (req, res) => {
  await ReviewsModel.findByIdAndDelete(req.params.id);

  res.redirect("/admin/reviews");
});

// LOG OUT
router.post("/log-out", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
});

//EXPORTS
module.exports = router;
