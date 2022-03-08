const { Schema, model } = require("mongoose");

const editSchema = new mongoose.Schema({
	favmovie: { type: String, required },
	quote: { type: String, required },
	quoteby: { type: String, required },
});

const EditsModel = model("Edits", editSchema);

module.exports = EditsModel;
