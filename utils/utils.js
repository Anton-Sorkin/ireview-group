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

module.exports = {
  hashPassword,
  comparePassword,
  adminAuth,
  getUniqueFilename,
};
