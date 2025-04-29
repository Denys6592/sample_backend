const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');

router.put('/status', proposalController.updateProposalStatus);

module.exports = router;