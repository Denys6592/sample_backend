const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    degree: { type: String },
    school: { type: String },
    year: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);