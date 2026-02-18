const mongoose = require('mongoose');

const riskLogSchema = new mongoose.Schema({
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    riskScore: { type: Number, required: true },
    details: { type: String }
}, { timestamps: true });

riskLogSchema.methods.toDict = async function () {
    await this.populate('departmentId');
    return {
        id: this._id,
        department: this.departmentId ? this.departmentId.name : 'Unknown',
        risk_score: this.riskScore,
        timestamp: this.createdAt.toISOString(),
        details: this.details
    };
};

module.exports = mongoose.model('RiskLog', riskLogSchema);
