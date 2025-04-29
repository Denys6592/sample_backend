// models/Channel.js

const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
    profilePic: { type: String, default: null }
});

module.exports = mongoose.model('Channel', channelSchema);
