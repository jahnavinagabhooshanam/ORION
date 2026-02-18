const calculateTotalRisk = (dept) => {
    const score = (
        dept.financeRisk * 0.30 +
        dept.hrRisk * 0.20 +
        dept.crmRisk * 0.20 +
        dept.vendorRisk * 0.15 +
        dept.supportRisk * 0.15
    );
    return Math.round(score * 10) / 10;
};

const calculateConfidence = (riskScore) => {
    const baseConfidence = 85.0;
    const variance = (Math.random() * 15) - 5; // -5 to 10
    if (riskScore > 75) {
        return Math.min(99.9, baseConfidence + 5 + variance);
    }
    return Math.min(99.9, baseConfidence + variance);
};

const generateAIExplanation = (dept, component, change) => {
    const contextMap = {
        "financeRisk": ["payroll anomalies", "budget overrun", "expense categorization errors"],
        "hrRisk": ["high turnover detected", "overtime spikes", "sentiment analysis drop"],
        "crmRisk": ["customer churn signals", "delayed support response", "contract disputes"],
        "vendorRisk": ["supply chain delay", "compliance check failure", "invoice discrepancy"],
        "supportRisk": ["SLA breaches", "ticket volume spike", "negative feedback loop"]
    };

    const reasons = contextMap[component] || ["general anomaly"];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];

    const direction = change > 0 ? "increased" : "decreased";

    return `Detected ${direction} variance in ${component.replace('Risk', '').toUpperCase()} due to ${reason}. Impact: ${Math.round(change * 10) / 10}%.`;
};

const getSHAPValues = (dept) => {
    const shapData = [
        { feature: "Finance", impact: dept.financeRisk * 0.3 * (0.8 + Math.random() * 0.4) },
        { feature: "HR", impact: dept.hrRisk * 0.2 * (0.8 + Math.random() * 0.4) },
        { feature: "CRM", impact: dept.crmRisk * 0.2 * (0.8 + Math.random() * 0.4) },
        { feature: "Vendor", impact: dept.vendorRisk * 0.15 * (0.8 + Math.random() * 0.4) },
        { feature: "Support", impact: dept.supportRisk * 0.15 * (0.8 + Math.random() * 0.4) },
    ];

    return shapData.sort((a, b) => b.impact - a.impact);
};

const simulateRiskUpdate = (dept) => {
    const components = ["financeRisk", "hrRisk", "crmRisk", "vendorRisk", "supportRisk"];
    const component = components[Math.floor(Math.random() * components.length)];

    const fluctuation = (Math.random() * 17) - 2; // -2 to 15

    const currentVal = dept[component];
    const newVal = Math.max(0.0, Math.min(100.0, currentVal + fluctuation));

    dept[component] = newVal;
    dept.riskScore = calculateTotalRisk(dept);

    return { component, fluctuation, newVal };
};

module.exports = {
    calculateTotalRisk,
    calculateConfidence,
    generateAIExplanation,
    getSHAPValues,
    simulateRiskUpdate
};
