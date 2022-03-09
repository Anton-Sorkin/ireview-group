const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: false },
  hashedPassword: { type: String, required: false },
  googleId: { type: String, required: true },
  role: { type: String, required: false },
  secret: String,
});

const UsersModel = model("Users", userSchema);

module.exports = UsersModel;
