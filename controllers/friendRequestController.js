// controllers/friendRequestController.js
const FriendRequest = require("../models/friendRequest");
const User = require("../models/User");
const Message = require("../models/Message");

exports.sendFriendRequest = async (req, res) => {

  try {
    let { requester, recipient } = req.body;

    const requesterInfo = await User.findOne({ uid: requester });
    recipient = await User.findOne({ userName: recipient });

    if (recipient) {
      if ( requesterInfo.role === "freelancer" && recipient.role === "client" ) {
        return res.status(400).json({ success: false, message: "You cannot send a friend request to client." });
      }
      recipient = recipient.uid;
    } else {
        return res.status(400).json({ success: false, message: "Please enter user's name correctly." });
    }
    
    if ( recipient === requester ) {
      return res.status(400).json({ success: false, message: "You cannot send a friend request to yourself" });
    }

    // Check if a friend request already exists
    const existingRequest = await FriendRequest.aggregate([
      {
        $match: {
          $or: [
            { requester, recipient},
            { requester:recipient, recipient: requester }
          ]
        }
      }
    ]).exec();

    if (existingRequest.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Friend request already sent/received." });
    }

    const newFriendRequest = new FriendRequest({ requester, recipient });
    await newFriendRequest.save();
    res.status(201).json({ success: true, friendRequest: newFriendRequest, message: "Friend request sent successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.respondToFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["accepted", "rejected", "cancel"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    if (status === "cancel") {
      await FriendRequest.findByIdAndDelete({_id: id})
      return res.status(200).json({
        success: true,
        message: "Message request is cancelled successfully."
      });
    }

    const friendRequest = await FriendRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!friendRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Message request not found" });
    }

    res.json({ success: true, friendRequest, message: `Message request is accepted successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const friendRequests = await FriendRequest.aggregate([
      {
        $match: { recipient: userId },
        $match: {
          $or: [
            { requester: userId },
            { recipient: userId }
          ]
        }
      },
      {
        $lookup: {
          from: "users", // "users" is the collection name for User model
          localField: "requester",
          foreignField: "uid",
          as: "requester",
        },
      },
      {
        $lookup: {
          from: "users", // "users" is the collection name for User model
          localField: "recipient",
          foreignField: "uid",
          as: "recipient",
        },
      },
      {
        $project: {
          status: 1,
          requester: { $arrayElemAt: ["$requester", 0] }, // Grab the first match
          recipient: { $arrayElemAt: ["$recipient", 0] }, // Grab the first match
        },
      },
    ]).exec();

    // console.log(friendRequests);

    return res.json({ success: true, friendRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFriendList = async (req, res) => {
  try {
    const { userId } = req.params;
    // const friendRequests = await FriendRequest.find({
    //   $or: [{ requester: userId }, { recipient: userId }],
    // }).lean();

    const friendLists = await FriendRequest.aggregate([
      {
        $match: {
          $or: [
            { requester: userId, status: "accepted" },
            { recipient: userId, status: "accepted" }
          ]
        }
      },
      {
        $lookup: {
          from: "users", // "users" is the collection name for User model
          localField: "requester",
          foreignField: "uid",
          as: "requester",
        },
      },
      {
        $lookup: {
          from: "users", // "users" is the collection name for User model
          localField: "recipient",
          foreignField: "uid",
          as: "recipient",
        },
      },
      {
        $project: {
          requester: { $arrayElemAt: ["$requester", 0] }, // Grab the first match
          recipient: { $arrayElemAt: ["$recipient", 0] }, // Grab the first match
        },
      },
    ]).exec();

    const newMessages = await Message.aggregate([
      {
        $match: {
          receiverId: userId,  // messages received by current user
          isSeen: false                // only unseen messages
        }
      },
      {
        $group: {
          _id: '$senderId',
          newMessagesCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'uid',
          as: 'senderInfo'
        }
      },
      {
        $unwind: '$senderInfo'
      },
      {
        $project: {
          senderId: '$_id',
          newMessagesCount: 1,
          fullName: '$senderInfo.fullName'
        }
      }
    ]);

    return res.json({ success: true, friendLists, newMessages });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
