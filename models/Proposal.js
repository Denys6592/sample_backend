const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    project: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        require: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    coverLetter: {
        type: String,
        maxlength: 5000
    },
    price: {
        type: Number
    },
    status: {
        type: String,
    },
    portfolios: {
        type: Array
    }
}, { timestamps: true });

proposalSchema.index({ project: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', proposalSchema);