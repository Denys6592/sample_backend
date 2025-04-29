const TMProject = require('../models/TMProject');
const TMComment = require('../models/TMComment');
const User = require('../models/User');
const TMRole = require('../models/TMRole');
const TMTask = require('../models/TMTask');

exports.createProject = async (req, res) => {
    try {
        const { tmProject, roles } = req.body;
        const user = await User.findOne({ uid: req.uid });

        const newProject = new TMProject({
            title: tmProject.title,
            isPrivate: tmProject.isPrivate,
            owner: user.id,
            slug: tmProject.title.split(' ').join('-').toLowerCase()
        });

        await newProject.save();

        if (roles.length) {
            roles.map(role => {
                const newRole = new TMRole({
                    project: newProject._id,
                    user: role.userId,
                    role: role.role
                });

                newRole.save();
            })
        }

        res.status(200).json(newProject);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const userId = req.uid;
        const user = await User.findOne({ uid: userId });
        const projects = await TMProject.find({ owner: user._id });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUsersByProject = async (req, res) => {
    try {
        const projectId = req.query.projectId;
        const users = await TMRole
            .find({ project: projectId })
            .populate('user');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasksByProject = async (req, res) => {
    try {
        const projectId = req.query.projectId;
        const tasks = await TMTask
            .find({ project: projectId, isActive: true })
            .populate('project lead assignee');

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.uid;
        const updates = req.body;

        const updatedProject = await TMProject.findOneAndUpdate(
            { _id: id, owner: userId },
            updates,
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.uid;

        const deletedProject = await TMProject.findOneAndDelete({
            _id: id,
            owner: userId
        });

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.uid });
        const { project, name, description, lead, assignee, dueDate, priority, status = "backlog" } = req.body;

        const newTask = new TMTask({
            project,
            name,
            description,
            creator: user._id,
            lead,
            assignee,
            dueDate,
            priority,
            status,
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.duplicateTask = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Task ID is required' });
    }

    try {
        const originalTask = await TMTask.findById(id);
        if (!originalTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const duplicatedTaskData = originalTask.toObject();
        delete duplicatedTaskData._id;

        const duplicatedTask = new TMTask(duplicatedTaskData);

        await duplicatedTask.populate('project lead assignee');
        await duplicatedTask.save();

        res.json(duplicatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while duplicating the task' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedTask = await TMTask
            .findByIdAndUpdate(id, updates, { new: true })
            .populate('project')
            .populate('assignee')
            .populate('lead');

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await TMTask.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCommentsByTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const comments = await TMComment.find({ task: taskId }).populate('author parent');

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error });
    }
}

exports.updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        const updatedComment = await TMComment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error });
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const deletedComment = await TMComment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
}

exports.getTmUserData = async (req, res) => {
    try {
        const email = req.params.id;
        const user = await User.findOne({ email: email });

        if (user) {
            res.status(200).send(user);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error Fetching Users', error });
    }
}

exports.createUserRole = async (req, res) => {
    try {
        const { project, user, role } = req.body;
        const tmRole = new TMRole({
            project: project,
            user: user,
            role: role
        });

        await tmRole.save();

        const populatedRole = await TMRole.findById(tmRole._id).populate('user');

        res.status(200).send(populatedRole);
    } catch (error) {
        res.status(500).json({ message: 'Error Creating User Role.', error });
    }
}

exports.updateUserRole = async (req, res) => {
    try {
        const id = req.params.id;
        const { role } = req.body;
        const tmRole = await TMRole.findByIdAndUpdate(id, { role: role }, { new: true });

        if (tmRole) {
            res.status(200).send(tmRole);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error Updating User Role.', error });
    }
}

exports.deleteUserRole = async (req, res) => {
    try {
        const id = req.params.id;
        const tmRole = await TMRole.findByIdAndDelete(id);

        if (tmRole) {
            res.status(200).json({ message: 'User Role deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error Updating User Role.', error });
    }
}