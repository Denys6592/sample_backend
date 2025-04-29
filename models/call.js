const mongoose = require("mongoose");

const callSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    callType: { type: String, enum: ["one-to-one", "group"], required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    isActive: { type: Boolean, default: true },
    // translationSessionId: { type: String } // Optional for tracking translation sessions
});

module.exports = mongoose.model("Call", callSchema);
