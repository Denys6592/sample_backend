const mongoose = require('mongoose');

const savedProjectSchema = new mongoose.Schema({
    freelancer: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    project: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SavedProject', savedProjectSchema);
