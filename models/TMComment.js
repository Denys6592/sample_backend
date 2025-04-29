const mongoose = require('mongoose');

const TMCommentSchema = new mongoose.Schema({
    task: {
        type: mongoose.Types.ObjectId,
        ref: 'TMTask',
        require: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    content: {
        type: String,
        require: true
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'TMComment',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('TMComment', TMCommentSchema);