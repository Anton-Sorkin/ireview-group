const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	username: { type: String, required: true },
	hashedPassword: { type: String, required: true },
	role: { type: String, required: true },
	reviews: { type: Schema.Types.ObjectId, ref: "Reviews", required: true },
	settings: { type: Schema.Types.ObjectId, ref: "Edits", required: true },
	secret: String,
});

const UsersModel = model("Users", userSchema);

module.exports = UsersModel;
