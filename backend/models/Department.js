const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    riskScore: { type: Number, default: 0.0 },
    financeRisk: { type: Number, default: 0.0 },
    hrRisk: { type: Number, default: 0.0 },
    crmRisk: { type: Number, default: 0.0 },
    vendorRisk: { type: Number, default: 0.0 },
    supportRisk: { type: Number, default: 0.0 }
}, { timestamps: true });

departmentSchema.methods.toDict = function () {
    return {
        id: this._id,
        name: this.name,
        risk_score: this.riskScore,
        details: {
            finance: this.financeRisk,
            hr: this.hrRisk,
            crm: this.crmRisk,
            vendor: this.vendorRisk,
            support: this.supportRisk
        }
    };
};

module.exports = mongoose.model('Department', departmentSchema);
