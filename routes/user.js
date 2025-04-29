const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * ============================================================
 *                   Profile & User Routes
 * ============================================================
 */

/**
 * @route   GET /
 * @desc    Retrieve the current user's data by ID
 * @access  Protected (requires authentication)
 */
router.get("/", authMiddleware, userController.getUserById);

/**
 * @route   GET /user/full
 * @desc    Retrieve the full data for the current user, including extended profile information
 * @access  Protected (requires authentication)
 */
router.get("/user/full", authMiddleware, userController.getUserFullData);

/**
 * @route   PUT /profile
 * @desc    Update the user's profile information, including avatar and portfolio files
 * @access  Protected (requires authentication)
 * @note    Uses upload middleware to handle file uploads:
 *          - avatar: Single file (maxCount: 1)
 *          - portfolios: Multiple files (maxCount: 100)
 */
router.put(
  "/profile",
  authMiddleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "portfolios", maxCount: 100 },
  ]),
  userController.updateProfile
);

/**
 * @route   DELETE /profile
 * @desc    Delete the user's profile
 * @access  Protected (requires authentication)
 */
router.delete("/profile", authMiddleware, userController.deleteProfile);

/**
 * ============================================================
 *             Project Matching & Talent Filtering Routes
 * ============================================================
 */

/**
 * @route   GET /bestMatchProjects
 * @desc    Retrieve projects that best match the user's skills or interests
 * @access  Public/Protected based on your implementation
 */
router.get("/bestMatchProjects", userController.getBestMatchProjects);

/**
 * @route   GET /filter
 * @desc    Filter talents based on specified criteria
 * @access  Public/Protected based on your implementation
 */
router.get("/filter", userController.filterTalents);

/**
 * ============================================================
 *          Feedback, Review, & Rating Management Routes
 * ============================================================
 */

/**
 * @route   POST /feedback
 * @desc    Submit user feedback
 * @access  Public/Protected based on your implementation
 */
router.post("/feedback", userController.giveFeedback);

/**
 * @route   PUT /feedback
 * @desc    Update existing user feedback
 * @access  Public/Protected based on your implementation
 */
router.put("/feedback", userController.updateFeedback);

/**
 * @route   POST /review
 * @desc    Submit a new review
 * @access  Public/Protected based on your implementation
 */
router.post("/review", userController.setReview);

/**
 * @route   PUT /review
 * @desc    Update an existing review
 * @access  Public/Protected based on your implementation
 */
router.put("/review", userController.updateReview);

/**
 * ============================================================
 *                     History Routes
 * ============================================================
 */

/**
 * @route   GET /history/client
 * @desc    Retrieve history data for a client on the platform
 * @access  Public/Protected based on your implementation
 */
router.get("/history/client", userController.getClientHistory);

/**
 * @route   GET /history/freelancer
 * @desc    Retrieve history data for a freelancer on the platform
 * @access  Public/Protected based on your implementation
 */
router.get("/history/freelancer", userController.getFreelancerHistory);


module.exports = router;
