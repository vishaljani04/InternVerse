const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    internId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Intern',
        required: true
    },
    certificateId: {
        type: String,
        unique: true,
        required: true
    },
    internName: {
        type: String,
        required: true
    },
    internshipRole: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    performanceRating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    pdfPath: {
        type: String,
        default: ''
    },
    issuedAt: {
        type: Date,
        default: Date.now
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
