const express = require("express");
const utils = require("../utils/utils.js");
const UsersModel = require("../models/UsersModels.js");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("login/login-user");
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  UsersModel.findOne({ username }, (err, user) => {
    if (user && utils.comparePassword(password, user.hashedPassword)) {
      const userData = {
        userId: user._id.toString(),
        username,
        role: user.role.toString(),
      };
      const accessToken = jwt.sign(userData, process.env.JWT_SECRET);

      res.cookie("token", accessToken);
      res.redirect("/main");
    } else {
      res.send("Login failed");
    }
  });
  //   console.log(req.body);
});

module.exports = router;
