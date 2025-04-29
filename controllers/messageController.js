const User = require("../models/User");
const Message = require("../models/Message");

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const files = req.files
      ? req.files.map((file) => file.filename )
      : [];

    if (!message && files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message or files are required",
      });
    }

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Sender, Receiver are required",
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      files,
      // senderName: sender.fullName,
      // senderAvatar: sender.avatar,
      // receiverName: receiver.fullName,
      // receiverAvatar: receiver.avatar,
    });

    await newMessage.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Message sent successfully",
        data: newMessage,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Messages
exports.getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: sender, receiverId: receiver },
        { senderId: receiver, receiverId: sender },
      ],
    }).sort({ timestamp: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit Message
exports.editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    console.log(`Editing message with ID: ${id}`);
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );

    if (!updatedMessage) { 
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    }

    console.log("Message updated:", updatedMessage);
    res.json({
      success: true,
      message: "Message updated",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark as Seen
exports.markAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { isSeen: true });
    res.json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.newMessageInit = async (req, res) => {
  const { sender, receiver } = req.params;
  console.log(sender, receiver);
  try {
    // Update all messages where senderId is sender and receiverId is receiver
    await Message.updateMany(
      { senderId: sender, receiverId: receiver, isSeen: false }, // Match criteria
      { $set: { isSeen: true } } // Update operation
    );
  } catch (error) {
    res.status(500).json({ success: false, message:error.message })
  }
  

}
