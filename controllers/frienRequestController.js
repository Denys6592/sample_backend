// controllers/friendRequestController.js
const FriendRequest = require('../models/friendRequest');
const User = require('../models/User');

exports.sendFriendRequest = async (req, res) => {
    try {
        const { requester, recipient } = req.body;

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({ requester, recipient });
        if (existingRequest) {
            return res.status(400).json({ success: false, message: 'Friend request already sent' });
        }

        const newFriendRequest = new FriendRequest({ requester, recipient });
        await newFriendRequest.save();
        res.status(201).json({ success: true, friendRequest: newFriendRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.respondToFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const friendRequest = await FriendRequest.findByIdAndUpdate(id, { status }, { new: true });

        if (!friendRequest) {
            return res.status(404).json({ success: false, message: 'Friend request not found' });
        }

        if (status === 'accepted') {
            await User.findByIdAndUpdate(friendRequest.requester, { $push: { friends: friendRequest.recipient } });
            await User.findByIdAndUpdate(friendRequest.recipient, { $push: { friends: friendRequest.requester } });
        }

        res.json({ success: true, friendRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFriendRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const friendRequests = await FriendRequest.find({ recipient: userId, status: 'pending' }).populate('requester');
        res.json({ success: true, friendRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};