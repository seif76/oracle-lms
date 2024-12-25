const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, default: 'admin' },
    permissions: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('admin', adminSchema);