const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    skills: {
        type: Array,
        require: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    location: {
        type: String
    },
    duration: {
        type: Number
    },
    description: {
        type: String,
        require: true
    },
    estimatedPrice: {
        type: Number
    },
    minHourlyRate: {
        type: Number
    },
    maxHourlyRate: {
        type: Number
    },
    type: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: 'todo'
    },
    scope: {
        type: String,
        default: 'large'
    },
    level: {
        type: String,
        default: 'entry'
    },
    freelancer: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);