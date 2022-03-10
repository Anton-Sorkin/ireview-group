const { Schema, model } = require("mongoose");

const pictureSchema = new Schema({
  name: { type: String, required: false },
  imageUrl: { type: String, required: true },
  picBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
});

const PictureModel = model("Pictures", pictureSchema);

module.exports = PictureModel;
