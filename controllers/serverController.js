// controllers/serverController.js

const multer = require("multer");
const path = require("path");
const Server = require("../models/serverModel");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

exports.createServer = [
  upload.single("file"),
  async (req, res) => {
    try {
      const { name, ownerId, description } = req.body;

      const filename = req.file.filename; // Get the saved filename

      const newServer = new Server({
        name,
        ownerId,
        description,
        members: [ownerId],
        imageUrl: filename,
      });

      await newServer.save();
      res.status(201).json({ success: true, server: newServer });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
];

exports.getServers = async (req, res) => {
  try {
    const servers = await Server.find().populate("ownerId members");
    res.json({ success: true, servers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteServer = async (req, res) => {
  try {
    const { id } = req.params;
    await Server.findByIdAndDelete(id);
    res.json({ success: true, message: "Server deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.editServer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedServer = await Server.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedServer) {
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });
    }
    res.json({ success: true, message: "Server updated", data: updatedServer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};
