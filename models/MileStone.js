const mongoose = require('mongoose');

const mileStoneSchema = new mongoose.Schema({
    project: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        require: true
    },
    freelancer: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true,
        default: 'progress'
    }
}, { timestamps: true });

module.exports = mongoose.model('MileStone', mileStoneSchema);