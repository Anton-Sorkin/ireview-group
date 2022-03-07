// REQUIERMENTS
const express = require("express");
const utils = require("../utils/utils.js");
const UsersModel = require("../models/UsersModels.js");

const router = express.Router();

router.get("/", (req, res) => {
	res.render("front-page/front-page");
});

//EXPORTS
module.exports = router;
