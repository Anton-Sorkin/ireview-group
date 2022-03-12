const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, 8);
  return hash;
};

const comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash);
  return correct;
};

const getUniqueFilename = (filename) => {
  const timestamp = Date.now();
  const extension = filename.split(".").pop();
  return `${timestamp}.${extension}`;
};

const adminAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWT_SECRET)) {
    const tokenData = jwt.decode(token, process.env.JWT_SECRET);
    if (tokenData.role !== "admin") {
      res.send("no auth");
    } else {
      next();
    }
  } else {
    res.sendStatus(401);
  }
};

function validateUser(name) {
  let valid = true;

  valid = valid && name.username;
  valid = valid && name.username.length > 3;
  valid = valid && name.username.length < 20;
  valid = valid && name.username.indexOf(" ") < 0;

  return valid;
}

function validateSettings(name) {
  let valid = true;

  valid = valid && name.favmovie;
  valid = valid && name.favmovie.length > 3;
  valid = valid && name.favmovie.length < 20;

  return valid;
}

function validateReviews(name) {
  let valid = true;

  valid = valid && name.review;
  valid = valid && name.review.length > 3;
  valid = valid && name.review.length < 100;

  return valid;
}

function validatePicture(name) {
  let valid = true;

  valid = valid && name.imageUrl;

  return valid;
}

module.exports = {
  hashPassword,
  comparePassword,
  adminAuth,
  getUniqueFilename,
  validateUser,
  validateSettings,
  validateReviews,
  validatePicture,
};
