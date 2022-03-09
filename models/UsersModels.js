const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: false },
  googleId: { type: String, required: true },
  role: { type: String, required: false },
  secret: String,
});

const UsersModel = mongoose.model("Users", userSchema);

module.exports = UsersModel;
