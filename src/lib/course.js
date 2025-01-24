const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher', required: true },
    createdAt: { type: Date, default: Date.now },
    imageUrl: {
        type: String, // Field to store the uploaded image URL
        required: false, // Set to true if the image is mandatory
      },
});

module.exports = mongoose.model('course', courseSchema);