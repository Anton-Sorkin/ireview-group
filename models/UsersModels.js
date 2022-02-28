const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	hashedPassword: { type: String, required: true },
	admin: { type: Boolean },
});

const UsersModel = mongoose.model("Users", userSchema);

module.exports = UsersModel;
