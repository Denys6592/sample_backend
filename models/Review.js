const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
    skills: {
        type: Number,
        require: true,
        default: 0
    },
    availability: {
        type: Number,
        require: true,
        default: 0
    },
    communication: {
        type: Number,
        require: true,
        default: 0
    },
    quality: {
        type: Number,
        require: true,
        default: 0
    },
    deadlines: {
        type: Number,
        require: true,
        default: 0
    },
    cooperation: {
        type: Number,
        require: true,
        default: 0
    },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);

