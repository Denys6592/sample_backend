const express = require("express");
const {
    startOneToOneCall,
    joinCall,
    startGroupCall,
    endCall
} = require("../controllers/callController");

const router = express.Router();

router.post("/start", startOneToOneCall);
router.post("/join", joinCall);
router.post("/group/start", startGroupCall);
router.post("/end", endCall);

module.exports = router;
