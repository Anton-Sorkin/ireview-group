const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	username: { type: String, required: true },
	hashedPassword: { type: String, required: true },
	role: { type: String, required: true },

	secret: String,
});

const UsersModel = model("Users", userSchema);

module.exports = UsersModel;
