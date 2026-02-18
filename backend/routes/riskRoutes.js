const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const RiskLog = require('../models/RiskLog');
const Alert = require('../models/Alert');
const {
    calculateTotalRisk,
    calculateConfidence,
    generateAIExplanation,
    getSHAPValues,
    simulateRiskUpdate
} = require('../services/riskEngine');

// @desc Initialize database with seed data
// @route POST /api/init-db
router.post('/init-db', async (req, res) => {
    try {
        const deptCount = await Department.countDocuments();
        if (deptCount > 0) {
            return res.json({ message: "Database already initialized" });
        }

        const depts = [
            { name: "Finance", financeRisk: 45, hrRisk: 20, crmRisk: 10, vendorRisk: 30, supportRisk: 10 },
            { name: "Engineering", financeRisk: 20, hrRisk: 15, crmRisk: 5, vendorRisk: 50, supportRisk: 40 },
            { name: "Sales", financeRisk: 30, hrRisk: 40, crmRisk: 60, vendorRisk: 20, supportRisk: 25 },
            { name: "HR", financeRisk: 10, hrRisk: 60, crmRisk: 10, vendorRisk: 40, supportRisk: 5 },
            { name: "Marketing", financeRisk: 50, hrRisk: 25, crmRisk: 40, vendorRisk: 30, supportRisk: 15 }
        ];

        for (let d of depts) {
            const dept = new Department(d);
            dept.riskScore = calculateTotalRisk(dept);
            await dept.save();

            // Seed some initial history
            for (let i = 0; i < 5; i++) {
                await RiskLog.create({
                    departmentId: dept._id,
                    riskScore: dept.riskScore - (Math.random() * 10),
                    details: "Initial baseline assessment"
                });
            }
        }

        // Seed one active critical alert
        const target = await Department.findOne({ name: "Finance" });
        await Alert.create({
            departmentId: target._id,
            severity: "High",
            message: `CRITICAL: Anomaly detected in ${target.name} payroll systems.`,
            resolved: false
        });

        res.status(201).json({ message: "Database initialized with rich seed data" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to initialize database" });
    }
});

// @desc Get risk summary
// @route GET /api/risk-summary
router.get('/risk-summary', async (req, res) => {
    const depts = await Department.find();
    const totalRisk = depts.length > 0
        ? depts.reduce((acc, d) => acc + d.riskScore, 0) / depts.length
        : 0;

    res.json({
        total_risk: Math.round(totalRisk * 10) / 10,
        department_count: depts.length,
        departments: depts.map(d => d.toDict())
    });
});

// @desc Get all departments
// @route GET /api/departments
router.get('/departments', async (req, res) => {
    const depts = await Department.find();
    res.json(depts.map(d => d.toDict()));
});

// @desc Get department by ID
// @route GET /api/departments/:id
router.get('/departments/:id', async (req, res) => {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ error: "Department not found" });
    res.json(dept.toDict());
});

// @desc Get department history
// @route GET /api/departments/:id/history
router.get('/departments/:id/history', async (req, res) => {
    const logs = await RiskLog.find({ departmentId: req.params.id })
        .sort({ createdAt: -1 })
        .limit(20);

    const results = await Promise.all(logs.map(l => l.toDict()));
    res.json(results);
});

// @desc Get latest alerts
// @route GET /api/alerts
router.get('/alerts', async (req, res) => {
    const alerts = await Alert.find()
        .sort({ createdAt: -1 })
        .limit(20);

    const results = await Promise.all(alerts.map(a => a.toDict()));
    res.json(results);
});

// @desc Resolve alert
// @route PUT /api/alerts/:id/resolve
router.put('/alerts/:id/resolve', async (req, res) => {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });

    alert.resolved = true;
    await alert.save();

    res.json({ message: "Alert resolved", alert: await alert.toDict() });
});

// @desc Get all risk logs
// @route GET /api/risk-logs
router.get('/risk-logs', async (req, res) => {
    const logs = await RiskLog.find()
        .sort({ createdAt: -1 })
        .limit(50);

    const results = await Promise.all(logs.map(l => l.toDict()));
    res.json(results);
});

// @desc Simulate risk event
// @route POST /api/simulate-risk-event
router.post('/simulate-risk-event', async (req, res) => {
    try {
        const depts = await Department.find();
        if (depts.length === 0) {
            return res.status(404).json({ error: "No departments found" });
        }

        const targetDept = depts[Math.floor(Math.random() * depts.length)];
        const { component, fluctuation, newVal } = simulateRiskUpdate(targetDept);
        await targetDept.save();

        const confidence = calculateConfidence(targetDept.riskScore);
        const explanation = generateAIExplanation(targetDept, component, fluctuation);
        const shapValues = getSHAPValues(targetDept);

        // Log the risk event
        const log = new RiskLog({
            departmentId: targetDept._id,
            riskScore: targetDept.riskScore,
            details: explanation
        });
        await log.save();

        // Create Alert if high risk
        let alert = null;
        if (targetDept.riskScore > 60) {
            alert = new Alert({
                departmentId: targetDept._id,
                severity: "High",
                message: `CRITICAL: ${explanation}. Confidence: ${confidence}%`,
                resolved: false
            });
            await alert.save();
        } else if (targetDept.riskScore > 40) {
            alert = new Alert({
                departmentId: targetDept._id,
                severity: "Medium",
                message: `WARNING: ${explanation}. Confidence: ${confidence}%`,
                resolved: false
            });
            await alert.save();
        }

        res.json({
            message: "Risk event simulated",
            department: targetDept.name,
            new_score: targetDept.riskScore,
            confidence: confidence,
            explanation: explanation,
            shap_values: shapValues,
            alert: alert ? await alert.toDict() : null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Risk simulation failed" });
    }
});

module.exports = router;
