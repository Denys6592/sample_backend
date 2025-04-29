const mongoose = require('mongoose');

const TMTaskSchema = new mongoose.Schema({
    project: {
        type: mongoose.Types.ObjectId,
        ref: 'TMProject',
        require: true
    },
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    lead: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    assignee: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    dueDate: {
        type: Date,
    },
    priority: {
        type: String,
        default: 'Low'
    },
    status: {
        type: String,
        default: 'backlog'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = new mongoose.model('TMTask', TMTaskSchema);