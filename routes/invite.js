// routes/inviteRoute.js
const express = require('express');
const { createInvite, respondToInvite, getInvites } = require('../controllers/inviteController');
const router = express.Router();

router.post('/create', createInvite);
router.put('/respond/:id', respondToInvite);
router.get('/:userId', getInvites);

module.exports = router;