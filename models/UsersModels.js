const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String },
  googleId: { type: String },
  role: { type: String, required: false },
  secret: String,
});

const UsersModel = model("Users", userSchema);

module.exports = UsersModel;
