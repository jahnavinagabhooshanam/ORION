const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    severity: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
    message: { type: String, required: true },
    resolved: { type: Boolean, default: false }
}, { timestamps: true });

alertSchema.methods.toDict = async function () {
    await this.populate('departmentId');
    return {
        id: this._id,
        department: this.departmentId ? this.departmentId.name : 'Unknown',
        severity: this.severity,
        message: this.message,
        timestamp: this.createdAt.toISOString(),
        resolved: this.resolved
    };
};

module.exports = mongoose.model('Alert', alertSchema);
