const mongoose = require('mongoose');

const internshipListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 200
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    location: {
        type: String,
        default: 'Remote'
    },
    type: {
        type: String,
        enum: ['remote', 'onsite', 'hybrid'],
        default: 'remote'
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    stipend: {
        type: String,
        default: 'Unpaid'
    },
    skills: [{
        type: String
    }],
    requirements: {
        type: String,
        default: ''
    },
    responsibilities: {
        type: String,
        default: ''
    },
    openings: {
        type: Number,
        default: 1
    },
    deadline: {
        type: Date,
        required: [true, 'Application deadline is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Add text index for search
internshipListingSchema.index({ title: 'text', company: 'text', department: 'text', description: 'text' });

module.exports = mongoose.model('InternshipListing', internshipListingSchema);
