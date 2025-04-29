const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: { type: String, ref: 'User', required: true },
    receiverId: { type: String, ref: 'User', required: true },
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', default: () => new mongoose.Types.ObjectId() },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', default: () => new mongoose.Types.ObjectId() },
    message: { type: String },
    files: [{ type: String }],
    isSeen: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);