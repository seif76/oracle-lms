const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, default: 'teacher' },
    subjects: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('teacher', teacherSchema);