const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Intern',
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline is required']
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'submitted', 'approved', 'rejected'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    attachments: [{
        filename: String,
        originalName: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    submissions: [{
        content: String,
        githubLink: String,
        files: [{
            filename: String,
            originalName: String,
            path: String
        }],
        submittedAt: { type: Date, default: Date.now }
    }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    feedback: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
