//REQUIREMENTS
const express = require("express");
const router = express.Router();

//GETS
router.get("*", (req, res) => {
  res.redirect("/");
});

//EXPORTS
module.exports = router;
