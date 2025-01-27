/*const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('enrollment', enrollmentSchema);*/
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
    coursesEnrolled: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true }, // Reference to the course
            enrolledAt: { type: Date, default: Date.now } // Timestamp for enrollment
        }
    ],
    videosWatched: [
        {
            videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'video', required: true }, // Reference to the video
            watchedAt: { type: Date, default: Date.now } // Timestamp for when the video was watched
        }
    ]
});

module.exports = mongoose.model('enrollment', enrollmentSchema);
