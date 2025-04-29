const express = require('express');
const multer = require('multer');
const path = require('path');
const { sendMessage, getMessages, editMessage, deleteMessage, markAsSeen, newMessageInit } = require('../controllers/messageController');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get .docx, .png, etc.
        const uniqueName = `${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    // if (file.mimetype.startsWith('video')) {
    //     console.log(`Uploading video: ${file.originalname}`);
    // }
    cb(null, true); // Accept all file types
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 10MB limit for all files
});

// Debugging Middleware to Log Incoming Data
router.use((req, res, next) => {
    // console.log("Request Fields:", req.body);
    // console.log("Uploaded Files:", req.files);
    next();
});

// Routes
router.post('/send', (req, res) => {
    upload.array('files', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: "Multer error: " + err.message });
        } else if (err) {
            return res.status(500).json({ error: "Server error: " + err.message });
        }
        sendMessage(req, res);
    });
});

router.get('/:sender/:receiver', getMessages);
router.put('/edit/:id', editMessage);
router.delete('/delete/:id', deleteMessage);
router.put('/seen/:id', markAsSeen);
router.post('/newMessageInit/:sender/:receiver', newMessageInit);

module.exports = router;
