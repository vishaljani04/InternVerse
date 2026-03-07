const Certificate = require('../models/Certificate');
const Intern = require('../models/Intern');
const Evaluation = require('../models/Evaluation');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { generateCertificatePDF } = require('../services/certificateService');
const { sendEmail, emailTemplates } = require('../services/emailService');
const crypto = require('crypto');
const path = require('path');

// Generate certificate
exports.generateCertificate = async (req, res) => {
    try {
        const { internId } = req.body;

        const intern = await Intern.findById(internId);
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern not found' });
        }

        // Check if certificate already exists
        const existingCert = await Certificate.findOne({ internId });
        if (existingCert) {
            return res.status(400).json({ success: false, message: 'Certificate already generated for this intern', certificate: existingCert });
        }

        // Calculate performance rating from evaluations
        const evaluations = await Evaluation.find({ internId });
        let performanceRating = 0;
        if (evaluations.length > 0) {
            const totalOverall = evaluations.reduce((sum, ev) => sum + ev.scores.overall, 0);
            performanceRating = Math.round((totalOverall / evaluations.length) * 10) / 10;
        }

        const certificateId = 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();
        const user = await User.findById(intern.userId._id || intern.userId);

        // Generate PDF
        const pdfResult = await generateCertificatePDF({
            certificateId,
            internName: user.name,
            internshipRole: intern.internshipRole,
            department: intern.department,
            startDate: intern.startDate,
            endDate: intern.endDate,
            performanceRating
        });

        // Save certificate record
        const certificate = await Certificate.create({
            internId,
            certificateId,
            internName: user.name,
            internshipRole: intern.internshipRole,
            department: intern.department,
            startDate: intern.startDate,
            endDate: intern.endDate,
            performanceRating,
            pdfPath: pdfResult.filePath,
            issuedBy: req.user._id
        });

        // Mark internship as completed
        intern.status = 'completed';
        intern.progress = 100;
        await intern.save();

        // Send in-app notifications
        if (intern && intern.userId) {
            await Notification.create({
                recipient: intern.userId._id || intern.userId,
                sender: req.user._id,
                title: '🎓 Internship Completed!',
                message: 'Congratulations! Your internship is complete and your certificate is ready.',
                type: 'certificate',
                relatedId: certificate._id
            });
        }

        res.status(201).json({ success: true, message: 'Certificate generated successfully', certificate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete certificate
exports.deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndDelete(req.params.id);
        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }
        res.json({ success: true, message: 'Certificate deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all certificates
exports.getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find()
            .populate({ path: 'internId', populate: { path: 'userId', select: 'name email' } })
            .populate('issuedBy', 'name')
            .sort({ createdAt: -1 });

        res.json({ success: true, certificates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get my certificates (intern)
exports.getMyCertificates = async (req, res) => {
    try {
        const intern = await Intern.findOne({ userId: req.user._id });
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Intern profile not found' });
        }

        const certificates = await Certificate.find({ internId: intern._id });
        res.json({ success: true, certificates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Download certificate PDF
exports.downloadCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }

        const filePath = path.join(__dirname, '..', certificate.pdfPath);
        res.download(filePath, `Certificate_${certificate.certificateId}.pdf`);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
