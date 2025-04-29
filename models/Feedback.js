const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    project: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        require: true
    },
    from: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    to: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    feedback: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);