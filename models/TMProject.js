const mongoose = require('mongoose');

const TMProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    status: {
        type: String,
        default: 'progress'
    },
    slug: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('TMProject', TMProjectSchema);