const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    internId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Intern',
        required: true
    },
    evaluatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scores: {
        technical: { type: Number, min: 0, max: 10, required: true },
        communication: { type: Number, min: 0, max: 10, required: true },
        problemSolving: { type: Number, min: 0, max: 10, required: true },
        teamWork: { type: Number, min: 0, max: 10, required: true },
        punctuality: { type: Number, min: 0, max: 10, required: true },
        overall: { type: Number, min: 0, max: 10, required: true }
    },
    comments: {
        type: String,
        default: ''
    },
    recommendations: {
        type: String,
        default: ''
    },
    period: {
        type: String,
        enum: ['monthly', 'mid-term', 'final'],
        default: 'monthly'
    }
}, {
    timestamps: true
});

evaluationSchema.pre(/^find/, function (next) {
    this.populate('evaluatorId', 'name email role');
    next();
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
