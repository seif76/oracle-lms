const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    youtubeLink: { type: String, required: true },
    image: {
        data: Buffer, // Store the binary data of the image
        contentType: String, // Store the MIME type of the image (e.g., "image/jpeg", "image/png")
       }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('video', videoSchema);