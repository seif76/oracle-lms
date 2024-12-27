/*const mongoose = require('mongoose');

const accessCodeSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'video', required: true },
    code: { type: String, required: true, unique: true },
    status: { type: String, default: 'active' }, // active, used, expired
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: false },
    usageCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('accessCode', accessCodeSchema);*/
const mongoose = require('mongoose');

const accessCodeSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'video', required: true },
    codes: [
        {
            code: { type: String, required: true }, // Unique code for access
            status: { type: String, default: 'active' }, // 'active', 'used', 'expired'
            usageCount: { type: Number, default: 0 } // Track the usage count for each code
        }
    ], // Array of codes with individual properties
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: false },
    createdAt: { type: Date, default: Date.now }
});

// Ensure unique constraint on each code in the codes array
accessCodeSchema.index({ 'codes.code': 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('accessCode', accessCodeSchema);
