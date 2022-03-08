const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	username: { type: String, required: true },
	hashedPassword: { type: String, required: true },
	role: { type: String, required: true },
	reviews: { type: Schema.Types.ObjectId, ref: "Reviews", required: false },
	// reviewedBy: { type: Schema.Types.ObjectId, ref: "Reviews", required: false },
	settings: { type: Schema.Types.ObjectId, ref: "Edits", required: false },
	secret: String,
});

const UsersModel = model("Users", userSchema);

module.exports = UsersModel;
