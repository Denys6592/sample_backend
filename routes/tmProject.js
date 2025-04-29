const express = require('express');
const router = express.Router();

const tmProjectController = require('../controllers/tmProjectController');
const upload = require('../middlewares/uploadMiddleware');

/**
 * ============================================================
 *                   Project Routes
 * ============================================================
 */

// Create a new project
router.post('/projects/new', tmProjectController.createProject);

// Retrieve all projects
router.get('/projects', tmProjectController.getProjects);

// Retrieve users associated with a project
router.get('/project/users', tmProjectController.getUsersByProject);

// Retrieve tasks associated with a project
router.get('/project/tasks', tmProjectController.getTasksByProject);

// Update a specific project by ID
router.put('/project/:id', tmProjectController.updateProject);

// Delete a specific project by ID
router.delete('/project/:id', tmProjectController.deleteProject);

/**
 * ============================================================
 *                   Task Routes
 * ============================================================
 */

// Create a new task with file attachments
router.post(
    '/tasks/new',
    upload.fields([{ name: 'attachments', maxCount: 100 }]),
    tmProjectController.createTask
);

// Duplicate a specific task by ID
router.post('/task/duplicate', tmProjectController.duplicateTask);

// Update a specific task by ID
router.put('/task/:id', tmProjectController.updateTask);

// Delete a specific task by ID
router.delete('/task/:id', tmProjectController.deleteTask);

/**
 * ============================================================
 *                   Comment Routes
 * ============================================================
 */

// Retrieve comments for a specific task
router.get('/comments/:taskId', tmProjectController.getCommentsByTask);

// Update a specific comment by ID
router.put('/comments/:id', tmProjectController.updateComment);

// Delete a specific comment by ID
router.delete('/comments/:id', tmProjectController.deleteComment);

/**
 * ============================================================
 *                   User Routes
 * ============================================================
 */

// Retrieve data for a specific user by ID
router.get('/user/:id', tmProjectController.getTmUserData);


/**
 * ============================================================
 *                   Role Routes
 * ============================================================
 */

// Create a new role
router.post('/role', tmProjectController.createUserRole);

// Update a specific role by ID
router.put('/role/:id', tmProjectController.updateUserRole);

// Delete a specific role by ID
router.delete('/role/:id', tmProjectController.deleteUserRole);

module.exports = router;
