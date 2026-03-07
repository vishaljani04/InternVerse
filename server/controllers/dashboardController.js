const User = require('../models/User');
const Intern = require('../models/Intern');
const Task = require('../models/Task');
const Evaluation = require('../models/Evaluation');
const Certificate = require('../models/Certificate');

// Admin dashboard stats
exports.getAdminStats = async (req, res) => {
    try {
        const [totalInterns, activeInterns, completedInternships, totalTasks, pendingEvaluations, certificatesGenerated, totalUsers] = await Promise.all([
            Intern.countDocuments(),
            Intern.countDocuments({ status: 'active' }),
            Intern.countDocuments({ status: 'completed' }),
            Task.countDocuments(),
            Evaluation.countDocuments(),
            Certificate.countDocuments(),
            User.countDocuments()
        ]);

        const pendingTasks = await Task.countDocuments({ status: 'pending' });
        const submittedTasks = await Task.countDocuments({ status: 'submitted' });
        const approvedTasks = await Task.countDocuments({ status: 'approved' });

        // Monthly intern trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyInterns = await Intern.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Task status distribution
        const taskStats = await Task.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Department distribution
        const departmentStats = await Intern.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Recent activity
        const recentInterns = await Intern.find().sort({ createdAt: -1 }).limit(5);
        const recentTasks = await Task.find().populate('assignedBy', 'name').sort({ createdAt: -1 }).limit(5);

        res.json({
            success: true,
            stats: {
                totalInterns,
                activeInterns,
                completedInternships,
                totalTasks,
                pendingTasks,
                submittedTasks,
                approvedTasks,
                pendingEvaluations,
                certificatesGenerated,
                totalUsers
            },
            charts: {
                monthlyInterns,
                taskStats,
                departmentStats
            },
            recent: {
                interns: recentInterns,
                tasks: recentTasks
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// HR dashboard stats
exports.getHRStats = async (req, res) => {
    try {
        const [totalInterns, activeInterns, pendingTasks, submittedTasks] = await Promise.all([
            Intern.countDocuments(),
            Intern.countDocuments({ status: 'active' }),
            Task.countDocuments({ status: 'pending' }),
            Task.countDocuments({ status: 'submitted' })
        ]);

        const recentEvaluations = await Evaluation.find()
            .populate({ path: 'internId', populate: { path: 'userId', select: 'name' } })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: { totalInterns, activeInterns, pendingTasks, submittedTasks },
            recentEvaluations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Intern dashboard stats
exports.getInternStats = async (req, res) => {
    try {
        const intern = await Intern.findOne({ userId: req.user._id });
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern profile not found' });
        }

        const [totalTasks, completedTasks, pendingTasks, evaluationCount, certificateCount] = await Promise.all([
            Task.countDocuments({ assignedTo: intern._id }),
            Task.countDocuments({ assignedTo: intern._id, status: 'approved' }),
            Task.countDocuments({ assignedTo: intern._id, status: 'pending' }),
            Evaluation.countDocuments({ internId: intern._id }),
            Certificate.countDocuments({ internId: intern._id })
        ]);

        const recentTasks = await Task.find({ assignedTo: intern._id })
            .sort({ createdAt: -1 })
            .limit(5);

        const latestEvaluation = await Evaluation.findOne({ internId: intern._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            intern,
            stats: {
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks: await Task.countDocuments({ assignedTo: intern._id, status: 'in-progress' }),
                evaluationCount,
                certificateCount,
                progress: intern.progress
            },
            recentTasks,
            latestEvaluation
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
