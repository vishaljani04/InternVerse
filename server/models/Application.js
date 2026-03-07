const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InternshipListing',
        required: true
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    resumePath: {
        type: String,
        default: ''
    },
    coverLetter: {
        type: String,
        default: ''
    },
    skills: [{
        type: String
    }],
    university: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ listingId: 1, applicantId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
