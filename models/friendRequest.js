// models/FriendRequest.js
const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema({
  requester: { type: String, ref: "User", required: true },
  recipient: { type: String, ref: "User", required: true },
  new: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FriendRequest", friendRequestSchema);