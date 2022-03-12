const { Schema, Types, model } = require("mongoose");

const userSchema = new Schema({
	username: { type: String, required: true },
	hashedPassword: { type: String },
	googleId: { type: String },
	role: { type: String, required: false },
	settings: { type: Types.ObjectId, ref: "Settings", required: true },
	timestamp: { type: String, required: true },
	secret: String,
});

const UsersModel = model("Users", userSchema);

module.exports = UsersModel;
