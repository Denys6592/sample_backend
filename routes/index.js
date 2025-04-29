// routes/index.js
const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const projectRouter = require('./project');
const proposalRouter = require('./proposal');
const tmProjectRouter = require('./tmProject');
const messageRouter = require('./messageRoute');
const serverRouter = require('./serverRoute');
const channelRouter = require('./channel');
const authMiddleware = require('../middlewares/authMiddleware');
const paymentRoute = require("./payment");
const friendRequest = require('./friendRequest');
const invite = require('./invite');
const callRoute = require('./call')


router.get('/example', (req, res) => {
    res.json({ message: 'Example route ' });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);

router.use('/projects',  projectRouter);
router.use('/proposals',  proposalRouter);
router.use('/tmProjects',  tmProjectRouter);
router.use('/messages', messageRouter);
router.use('/servers',  serverRouter);
router.use('/channels', channelRouter);
router.use('/payments',  paymentRoute);
router.use('/friendRequests',friendRequest);
router.use('/invites',invite);
router.use('/call', callRoute);

module.exports = router;