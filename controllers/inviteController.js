// controllers/inviteController.js
const Invite = require('../models/Invite');
const Server = require('../models/serverModel');
const User = require('../models/User');

exports.createInvite = async (req, res) => {
    try {
        const { serverId, inviterId, inviteeEmail } = req.body;
        const newInvite = new Invite({ serverId, inviterId, inviteeEmail });
        await newInvite.save();
        res.status(201).json({ success: true, invite: newInvite });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.respondToInvite = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const invite = await Invite.findByIdAndUpdate(id, { status }, { new: true });

        if (!invite) {
            return res.status(404).json({ success: false, message: 'Invite not found' });
        }

        if (status === 'accepted') {
            const user = await User.findOne({ email: invite.inviteeEmail });
            await Server.findByIdAndUpdate(invite.serverId, { $push: { members: user._id } });
        }

        res.json({ success: true, invite });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getInvites = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        const invites = await Invite.find({ inviteeEmail: user.email, status: 'pending' }).populate('serverId inviterId');
        res.json({ success: true, invites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};