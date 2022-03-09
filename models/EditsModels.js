const { Schema, model } = require("mongoose");

const editSchema = new Schema({
  favmovie: { type: String, required: true },
  quote: { type: String, required: true },
  quoteby: { type: String, required: true },
  settingsBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
});

const EditsModel = model("Edits", editSchema);

module.exports = EditsModel;
