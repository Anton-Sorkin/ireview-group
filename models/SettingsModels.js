const { Schema, model } = require("mongoose");

const settingsSchema = new Schema({
	favmovie: { type: String },
	quote: { type: String },
	quoteby: { type: String },
});

const SettingsModel = model("Settings", settingsSchema);

module.exports = SettingsModel;
