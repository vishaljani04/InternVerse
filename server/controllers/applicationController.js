const Application = require('../models/Application');
const InternshipListing = require('../models/InternshipListing');
const Intern = require('../models/Intern');
const Notification = require('../models/Notification');
const { sendEmail } = require('../services/emailService');

// Apply for internship (Intern)
exports.applyForInternship = async (req, res) => {
    try {
        if (req.user.role !== 'intern') {
            return res.status(403).json({ success: false, message: 'Only intern accounts can apply for internships' });
        }

        const { listingId, coverLetter, skills, university, phone } = req.body;

        const listing = await InternshipListing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Internship listing not found' });
        }
        if (!listing.isActive || listing.deadline < new Date()) {
            return res.status(400).json({ success: false, message: 'This internship is no longer accepting applications' });
        }

        // Check duplicate
        const existing = await Application.findOne({ listingId, applicantId: req.user._id });
        if (existing) {
            return res.status(400).json({ success: false, message: 'You have already applied for this internship' });
        }

        // Handle resume upload
        let resumePath = '';
        if (req.file) {
            resumePath = `/uploads/${req.file.filename}`;
        }

        const application = await Application.create({
            listingId,
            applicantId: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: phone || req.user.phone || '',
            resumePath,
            coverLetter: coverLetter || '',
            skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
            university: university || ''
        });

        res.status(201).json({ success: true, message: 'Application submitted successfully!', application });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already applied for this internship' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get my applications (Intern)
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user._id })
            .populate('listingId', 'title company department type location stipend')
            .sort({ createdAt: -1 });
        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all applications (Admin & HR)
exports.getAllApplications = async (req, res) => {
    try {
        const { listingId, status } = req.query;
        const query = {};

        // If HR, only show applications for their own listings
        if (req.user.role === 'hr') {
            const myListings = await InternshipListing.find({ createdBy: req.user._id }).select('_id');
            const myListingIds = myListings.map(l => l._id);
            query.listingId = { $in: myListingIds };
        }

        if (listingId) {
            // If HR specifies a listingId, ensure they own it
            if (req.user.role === 'hr') {
                const listing = await InternshipListing.findOne({ _id: listingId, createdBy: req.user._id });
                if (!listing) return res.status(403).json({ success: false, message: 'Access denied to this listing' });
            }
            query.listingId = listingId;
        }

        if (status) query.status = status;

        const applications = await Application.find(query)
            .populate('listingId', 'title company department')
            .populate('applicantId', 'name email phone skills university')
            .sort({ createdAt: -1 });

        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update application status (Admin)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status, adminNotes: adminNotes || '' },
            { new: true }
        ).populate('listingId', 'title company department');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Send email notification on status change
        const statusMessages = {
            shortlisted: `Congratulations! You've been shortlisted for "${application.listingId?.title}" at ${application.listingId?.company}.`,
            accepted: `Great news! Your application for "${application.listingId?.title}" at ${application.listingId?.company} has been accepted!`,
            rejected: `We regret to inform you that your application for "${application.listingId?.title}" was not selected at this time.`
        };

        if (statusMessages[status]) {
            await Notification.create({
                recipient: application.applicantId,
                sender: req.user._id,
                title: 'Application Update',
                message: statusMessages[status],
                type: 'application',
                relatedId: application._id
            });
        }

        // Create Intern Profile if accepted
        if (status === 'accepted') {
            const existingIntern = await Intern.findOne({ userId: application.applicantId });
            if (!existingIntern) {
                await Intern.create({
                    userId: application.applicantId,
                    department: application.listingId.department || 'N/A',
                    internshipRole: application.listingId.title,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Default 3 months
                    skills: application.skills,
                    university: application.university
                });
            }
        }

        res.json({ success: true, application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check if user already applied
exports.checkApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            listingId: req.params.listingId,
            applicantId: req.user._id
        });
        res.json({ success: true, hasApplied: !!application, application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
