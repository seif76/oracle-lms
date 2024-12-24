const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('enrollment', enrollmentSchema);