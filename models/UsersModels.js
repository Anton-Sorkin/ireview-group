const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  ROLE: { type: String },
  secret: String,
});

const UsersModel = mongoose.model("Users", userSchema);

module.exports = UsersModel;
