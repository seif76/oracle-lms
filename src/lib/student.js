const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    parentContact: { type: String, required: false },
    role: { type: String, default: 'student' },
    devices: [{ type: String, max: 2 }],
    createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('student', studentSchema);