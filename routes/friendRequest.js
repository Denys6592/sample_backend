// routes/friendRequestRoute.js
const express = require('express');
const { sendFriendRequest, respondToFriendRequest, getFriendRequests, getFriendList } = require('../controllers/friendRequestController');
const router = express.Router();

router.post('/send', sendFriendRequest);
router.put('/respond/:id', respondToFriendRequest);
router.get('/:userId', getFriendRequests);
router.get('/friendList/:userId', getFriendList);

module.exports = router;