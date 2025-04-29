const mongoose = require('mongoose');

const TMRoleSchema = new mongoose.Schema({
    project: {
        type: mongoose.Types.ObjectId,
        ref: 'TMProject',
        require: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    role: {
        type: String,
        require: true,
        default: 'guest'
    }
}, { timestamps: true });

module.exports = new mongoose.model('TMRole', TMRoleSchema);