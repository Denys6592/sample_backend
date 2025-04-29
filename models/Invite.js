// models/Invite.js
const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
    inviterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inviteeEmail: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invite', inviteSchema);