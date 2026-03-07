const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentor: {
        type: String,
        default: ''
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    internshipRole: {
        type: String,
        required: [true, 'Internship role is required'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'terminated', 'on-hold'],
        default: 'active'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    skills: [{
        type: String
    }],
    bio: {
        type: String,
        default: ''
    },
    university: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Populate user details by default
internSchema.pre(/^find/, function (next) {
    this.populate('userId', 'name email avatar phone isActive');
    next();
});

module.exports = mongoose.model('Intern', internSchema);
