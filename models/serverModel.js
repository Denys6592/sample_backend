const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: String, require: true },
  imageUrl: { type: String },
  members: [{ type: String }],
});

module.exports = mongoose.model("Server", serverSchema);