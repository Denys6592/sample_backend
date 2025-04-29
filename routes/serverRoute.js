const express = require('express');
const { createServer, getServers, deleteServer, editServer } = require('../controllers/serverController');
const router = express.Router();

router.post('/create', createServer);
router.get('/', getServers);
router.delete('/:id', deleteServer);
router.put('/:id', editServer);

module.exports = router;