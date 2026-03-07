const Task = require('../models/Task');
const Intern = require('../models/Intern');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail, emailTemplates } = require('../services/emailService');

// Create task
exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, deadline, priority, attachments } = req.body;

        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user._id,
            deadline,
            priority: priority || 'medium',
            attachments: attachments || [],
            status: 'assigned'
        });

        // Send in-app notification
        const intern = await Intern.findById(assignedTo);
        if (intern && intern.userId) {
            await Notification.create({
                recipient: intern.userId._id || intern.userId,
                sender: req.user._id,
                title: 'New Task Assigned',
                message: `You have been assigned a new task: ${title}`,
                type: 'task',
                relatedId: task._id
            });
        }

        res.status(201).json({ success: true, message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all tasks (with filters)
exports.getTasks = async (req, res) => {
    try {
        const { status, assignedTo, priority, page = 1, limit = 20 } = req.query;
        const query = {};

        if (status) query.status = status;
        if (assignedTo) query.assignedTo = assignedTo;
        if (priority) query.priority = priority;

        const total = await Task.countDocuments(query);
        const tasks = await Task.find(query)
            .populate('assignedTo')
            .populate('assignedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            success: true,
            tasks,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get tasks for current intern
exports.getMyTasks = async (req, res) => {
    try {
        const intern = await Intern.findOne({ userId: req.user._id });
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern profile not found' });
        }

        const { status } = req.query;
        const query = { assignedTo: intern._id };
        if (status) query.status = status;

        const tasks = await Task.find(query)
            .populate('assignedBy', 'name email')
            .sort({ deadline: 1 });

        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo')
            .populate('assignedBy', 'name email')
            .populate('comments.userId', 'name avatar');

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update task status (intern)
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Update task (Admin/HR)
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
