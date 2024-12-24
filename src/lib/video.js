const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    youtubeLink: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('video', videoSchema);