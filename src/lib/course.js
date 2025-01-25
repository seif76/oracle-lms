const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher', required: true },
    createdAt: { type: Date, default: Date.now },
    image: {
       data: Buffer, // Store the binary data of the image
       contentType: String, // Store the MIME type of the image (e.g., "image/jpeg", "image/png")
      }, 
});

module.exports = mongoose.model('course', courseSchema);