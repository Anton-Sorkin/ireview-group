//REQUIREMENTS
const express = require("express");
const router = express.Router();

//GETS
router.get("*", (req, res) => {
  res.render("notFound", {
    title: "404",
    errorMessage: "Page not found.",
  });
});

//EXPORTS
module.exports = router;
