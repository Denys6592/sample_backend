const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    filePath: {
        type: String,
    },
    freelancer: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    skills: {
        type: Array,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);