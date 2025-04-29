const mongoose = require("mongoose");
const Call = require("../models/call");
const { v4: uuidv4 } = require("uuid");

let io;

exports.setSocketInstance = (socketIo) => {
    io = socketIo;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 🟢 Start One-to-One Call (Others Can Join Using Link)
exports.startOneToOneCall = async (req, res) => {
    const { callerId, receiverId } = req.body;

    if (!callerId || !receiverId) {
        return res.status(400).json({ message: "Caller and Receiver IDs are required." });
    }

    if (!isValidObjectId(callerId) || !isValidObjectId(receiverId)) {
        return res.status(400).json({ message: "Invalid Caller or Receiver ID format." });
    }

    try {
        let existingCall = await Call.findOne({
            callType: "one-to-one",
            participants: { $all: [callerId, receiverId] },
            isActive: true
        });

        if (existingCall) {
            return res.status(200).json({ roomUrl: `https://meet.jit.si/${existingCall.roomId}` });
        }

        const roomId = uuidv4();
        const roomUrl = `https://meet.jit.si/${roomId}`;

        const newCall = new Call({
            roomId,
            callType: "one-to-one",
            participants: [callerId, receiverId],
            isActive: true
        });

        await newCall.save();
        io.emit("call-started", { roomId, participants: [callerId, receiverId] });

        res.status(200).json({ roomUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟢 Join Call Using Link
exports.joinCall = async (req, res) => {
    const { roomId, participantId } = req.body;

    if (!roomId || !participantId) {
        return res.status(400).json({ message: "Room ID and Participant ID are required." });
    }

    if (!isValidObjectId(participantId)) {
        return res.status(400).json({ message: "Invalid Participant ID format." });
    }

    try {
        let call = await Call.findOne({ roomId, isActive: true });

        if (!call) {
            return res.status(404).json({ message: "Call not found or already ended." });
        }

        if (!call.participants.includes(participantId)) {
            call.participants.push(participantId);
            await call.save();
        }

        io.emit("participant-joined", { roomId, participantId });
        res.status(200).json({ roomUrl: `https://meet.jit.si/${roomId}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟢 Start Group Call
exports.startGroupCall = async (req, res) => {
    const { serverId, channelId, participants } = req.body;

    if (!serverId || !channelId || !participants) {
        return res.status(400).json({ message: "Server ID, Channel ID, and Participants are required." });
    }

    if (!isValidObjectId(serverId) || !isValidObjectId(channelId)) {
        return res.status(400).json({ message: "Invalid Server or Channel ID format." });
    }

    let existingCall = await Call.findOne({
        callType: "group",
        serverId,
        channelId,
        isActive: true
    });

    if (existingCall) {
        return res.status(200).json({ roomUrl: `https://meet.jit.si/${existingCall.roomId}` });
    }

    const roomId = uuidv4();
    const roomUrl = `https://meet.jit.si/${roomId}`;

    try {
        const newCall = new Call({
            roomId,
            callType: "group",
            serverId,
            channelId,
            participants,
            isActive: true
        });

        await newCall.save();
        io.emit("group-call-started", { roomId, participants });

        res.status(200).json({ roomUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟢 End Call
exports.endCall = async (req, res) => {
    const { roomId } = req.body;

    if (!roomId) {
        return res.status(400).json({ message: "Room ID is required." });
    }

    try {
        const call = await Call.findOneAndUpdate(
            { roomId },
            { isActive: false, endTime: new Date() }
        );

        if (!call) {
            return res.status(404).json({ message: "Call not found." });
        }

        io.emit("call-ended", { roomId });
        res.status(200).json({ message: "Call ended successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};