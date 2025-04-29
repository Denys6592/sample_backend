const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const upload = require('../middlewares/uploadMiddleware');

/**
 * ============================================================
 *                   Project Routes
 * ============================================================
 */

// Retrieve project details by ID
router.get('/getProjectById', projectController.getProjectById);

// Create a new project
router.post('/new', projectController.createProject);

// Save a project for later reference
router.post('/saveProject', projectController.saveProject);

// Retrieve all saved projects
router.get('/savedProjects', projectController.getSavedProjects);

/**
 * ============================================================
 *                   Proposal Routes
 * ============================================================
 */

// Submit a proposal with portfolio attachments
router.post(
    '/writeProposal',
    upload.fields([{ name: 'portfolios', maxCount: 100 }]),
    projectController.writeProposal
);

// Retrieve all proposals for a specific project
router.get('/proposals', projectController.getAllProposalsForProject);

/**
 * ============================================================
 *                   Project Filtering
 * ============================================================
 */

// Filter projects based on certain criteria
router.get('/filter', projectController.filterProjects);

/**
 * ============================================================
 *                   Project Management
 * ============================================================
 */

// Award a project to a freelancer
router.post('/award', projectController.awardProject);

// Accept an awarded project
router.post('/accept', projectController.acceptProject);

// Reject a project offer
router.post('/reject', projectController.rejectProject);

// Mark a project as completed
router.post('/complete', projectController.completeProject);

// Create a milestone for a project
router.post('/createMileStone', projectController.createMileStone);

module.exports = router;
