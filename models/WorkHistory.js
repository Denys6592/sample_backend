const mongoose = require("mongoose");

const workHistorySchema = new mongoose.Schema(
  {
    position: { type: String },
    company: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkHistory", workHistorySchema);
