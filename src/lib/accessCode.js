const mongoose = require('mongoose');

const accessCodeSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'video', required: true },
    code: { type: String, required: true, unique: true },
    status: { type: String, default: 'active' }, // active, used, expired
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: false },
    usageCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('accessCode', accessCodeSchema);