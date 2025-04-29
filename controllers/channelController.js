const Channel = require('../models/channel');
const fs = require('fs');
const path = require('path');

exports.createChannel = async (req, res) => {
    try {
        const { name, serverId } = req.body;
        let profilePic = null;

        if (req.file) {
            profilePic = req.file.path;
        }

        const newChannel = new Channel({ name, serverId, profilePic });
        await newChannel.save();

        // Emit event to all connected clients
        const io = req.app.get('io');
        if (io) io.emit('channelCreated', newChannel);

        res.status(201).json({ success: true, channel: newChannel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.editChannel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        let updateData = { name };

        if (req.file) {
            const channel = await Channel.findById(id);

            if (channel && channel.profilePic) {
                try {
                    fs.unlinkSync(path.resolve(channel.profilePic)); // Delete old profile picture if it exists
                } catch (err) {
                    console.warn('Profile picture deletion error:', err.message);
                }
            }

            updateData.profilePic = req.file.path;
        }

        const updatedChannel = await Channel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedChannel) {
            return res.status(404).json({ success: false, message: 'Channel not found' });
        }

        // Emit event to notify all clients
        const io = req.app.get('io');
        if (io) io.emit('channelUpdated', updatedChannel);

        res.json({ success: true, message: 'Channel updated', channel: updatedChannel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getChannels = async (req, res) => {
    try {
        const { serverId } = req.params;
        const channels = await Channel.find({ serverId });
        res.json({ success: true, channels });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// exports.editChannel = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name } = req.body;
//         const updatedChannel = await Channel.findByIdAndUpdate(id, { name }, { new: true });
//         if (!updatedChannel) {
//             return res.status(404).json({ success: false, message: 'Channel not found' });
//         }
//         res.json({ success: true, message: 'Channel updated', data: updatedChannel });
exports.deleteChannel = async (req, res) => {
    try {
        const { id } = req.params;
        const channel = await Channel.findByIdAndDelete(id);

        if (channel && channel.profilePic) {
            try {
                fs.unlinkSync(path.resolve(channel.profilePic)); // Delete profile picture if it exists
            } catch (err) {
                console.warn('Profile picture deletion error:', err.message);
            }
        }

        // Emit event to notify all clients
        const io = req.app.get('io');
        if (io) io.emit('channelDeleted', { channelId: id });

        res.json({ success: true, message: 'Channel deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
