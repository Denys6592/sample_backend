const { Server } = require("socket.io");
const User = require("../models/User");
const FriendRequest = require("../models/friendRequest");

const onlineUsers = new Map();

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust as needed
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle send-message-request
    socket.on("send-message-request", async ({ toUserId, fromUserId }) => {
      try {
        const toUser = await User.findOne({ userName: toUserId });
        const fromUser = await User.findOne({ uid: fromUserId });

        if (!toUser || !fromUser) {
          console.error("User not found");
          return;
        }

        const toUserUid = toUser.uid;
        const fromUserName = fromUser.userName;
        const receiverSocketId = onlineUsers.get(toUserUid);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message-request-received", {
            fromUserName,
            message: "You received a new message request",
          });
        }
      } catch (error) {
        console.error("Error in send-message-request:", error);
      }
    });

    // Handle accept-message-request
    socket.on("accept-message-request", async ({ requestId, fromUserId }) => {
      try {
        const requestUser = await FriendRequest.findById(requestId);
        const receiverSocketId = onlineUsers.get(requestUser.requester);
        const fromUser = await User.findOne({ uid: fromUserId });

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("accept-message-request", {
            fromUser: fromUser.fullName,
            message: "accepted your request.",
          });
        }
      } catch (error) {
        console.error("Error in accept-message-request:", error);
      }
    });

    // Handle cancel-message-request
    socket.on("cancel-message-request", async ({ requestId, fromUserId }) => {
      try {
        const requestUser = await FriendRequest.findById(requestId);
        let receiverSocketId = onlineUsers.get(requestUser.recipient);

        if (fromUserId === requestUser.recipient) {
          receiverSocketId = onlineUsers.get(requestUser.requester);
        }

        const fromUser = await User.findOne({ uid: fromUserId });

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("cancel-message-request", {
            fromUser: fromUser.userName,
            message: "cancelled you from their message list.",
          });
        }
      } catch (error) {
        console.error("Error in cancel-message-request:", error);
      }
    });

    // Handle typing status
    socket.on("typing", ({ senderId, receiverId, isTyping }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typingStatus", { senderId, isTyping });
      }
    });

    // Handle new message
    socket.on("new Message", ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new Message", { senderId });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

module.exports = { setupSocket };