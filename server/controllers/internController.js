const Intern = require('../models/Intern');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../services/emailService');

// Create intern (Admin/HR)
exports.createIntern = async (req, res) => {
    try {
        const { name, email, password, department, internshipRole, startDate, endDate, mentor, mentorId, university, skills, bio } = req.body;

        // Create user account
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Email already registered.' });
        }

        user = await User.create({
            name,
            email,
            password: password || 'intern@123',
            role: 'intern',
            department
        });

        // Create intern profile
        const intern = await Intern.create({
            userId: user._id,
            department,
            internshipRole,
            startDate,
            endDate,
            mentor: mentor || '',
            mentorId: mentorId || null,
            university: university || '',
            skills: skills || [],
            bio: bio || ''
        });

        // Send welcome email
        const template = emailTemplates.internApproval(name);
        await sendEmail(email, template.subject, template.html);

        const populated = await Intern.findById(intern._id).populate('userId', 'name email department');

        res.status(201).json({ success: true, message: 'Intern created successfully', intern: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all interns
exports.getInterns = async (req, res) => {
    try {
        const { status, department, search, page = 1, limit = 20 } = req.query;
        const query = {};

        if (status) query.status = status;
        if (department) query.department = department;

        if (search) {
            const users = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            query.userId = { $in: users.map(u => u._id) };
        }

        const total = await Intern.countDocuments(query);
        const interns = await Intern.find(query)
            .populate('userId', 'name email department')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            success: true,
            interns,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get intern by ID
exports.getInternById = async (req, res) => {
    try {
        const intern = await Intern.findById(req.params.id).populate('userId', 'name email department');
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern not found' });
        }
        res.json({ success: true, intern });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get intern by userId (for intern's own data)
exports.getMyInternProfile = async (req, res) => {
    try {
        const intern = await Intern.findOne({ userId: req.user._id });
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern profile not found' });
        }
        res.json({ success: true, intern });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update intern
exports.updateIntern = async (req, res) => {
    try {
        const intern = await Intern.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern not found' });
        }
        res.json({ success: true, intern });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle intern status
exports.toggleInternStatus = async (req, res) => {
    try {
        const intern = await Intern.findById(req.params.id);
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern not found' });
        }

        // Toggle status
        const newStatus = intern.status === 'active' ? 'on-hold' : 'active';
        intern.status = newStatus;
        await intern.save();

        // Also toggle user active status
        await User.findByIdAndUpdate(intern.userId._id || intern.userId, {
            isActive: newStatus === 'active'
        });

        const populatedIntern = await Intern.findById(intern._id).populate('userId', 'name email department');
        res.json({ success: true, message: `Intern ${newStatus === 'active' ? 'activated' : 'deactivated'}`, intern: populatedIntern });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete intern
exports.deleteIntern = async (req, res) => {
    try {
        const intern = await Intern.findById(req.params.id);
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern not found' });
        }

        await User.findByIdAndDelete(intern.userId._id || intern.userId);
        await Intern.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Intern deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
