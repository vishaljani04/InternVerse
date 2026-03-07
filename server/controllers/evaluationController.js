const Evaluation = require('../models/Evaluation');
const Intern = require('../models/Intern');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail, emailTemplates } = require('../services/emailService');

// Create evaluation
exports.createEvaluation = async (req, res) => {
    try {
        const { internId, scores, comments, recommendations, period } = req.body;

        const intern = await Intern.findById(internId);
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern not found' });
        }

        const evaluation = await Evaluation.create({
            internId,
            evaluatorId: req.user._id,
            scores,
            comments,
            recommendations,
            period: period || 'monthly'
        });

        const populated = await Evaluation.findById(evaluation._id);

        // Send in-app notification
        if (intern && intern.userId) {
            await Notification.create({
                recipient: intern.userId._id || intern.userId,
                sender: req.user._id,
                title: 'New Evaluation Published',
                message: `Your performance evaluation for the period (${period || 'monthly'}) has been published.`,
                type: 'evaluation',
                relatedId: evaluation._id
            });
        }

        res.status(201).json({ success: true, message: 'Evaluation created successfully', evaluation: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all evaluations (Admin/HR)
exports.getEvaluations = async (req, res) => {
    try {
        const { internId, period, page = 1, limit = 20 } = req.query;
        const query = {};
        if (internId) query.internId = internId;
        if (period) query.period = period;

        const total = await Evaluation.countDocuments(query);
        const evaluations = await Evaluation.find(query)
            .populate({ path: 'internId', populate: { path: 'userId', select: 'name email' } })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            success: true,
            evaluations,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get evaluations for current intern
exports.getMyEvaluations = async (req, res) => {
    try {
        const intern = await Intern.findOne({ userId: req.user._id });
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern profile not found' });
        }

        const evaluations = await Evaluation.find({ internId: intern._id }).sort({ createdAt: -1 });
        res.json({ success: true, evaluations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get evaluation by ID
exports.getEvaluationById = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id)
            .populate({ path: 'internId', populate: { path: 'userId', select: 'name email' } });
        if (!evaluation) {
            return res.status(404).json({ success: false, message: 'Evaluation not found' });
        }
        res.json({ success: true, evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update evaluation
exports.updateEvaluation = async (req, res) => {
    try {
        const evaluation = await Evaluation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!evaluation) {
            return res.status(404).json({ success: false, message: 'Evaluation not found' });
        }
        res.json({ success: true, evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete evaluation
exports.deleteEvaluation = async (req, res) => {
    try {
        const evaluation = await Evaluation.findByIdAndDelete(req.params.id);
        if (!evaluation) {
            return res.status(404).json({ success: false, message: 'Evaluation not found' });
        }
        res.json({ success: true, message: 'Evaluation deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
