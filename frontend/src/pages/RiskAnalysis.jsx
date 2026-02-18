import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Brain, CheckCircle } from 'lucide-react';

const RiskAnalysis = () => {
    const [riskLogs, setRiskLogs] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiInsight, setAiInsight] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [logsRes, deptsRes] = await Promise.all([
                    api.get('/risk-logs'),
                    api.get('/departments')
                ]);
                setRiskLogs(logsRes.data);
                setDepartments(deptsRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch risk data", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const simulateRisk = async () => {
        try {
            const res = await api.post('/simulate-risk-event');
            setAiInsight(res.data);
            // Refresh logs
            const logsRes = await api.get('/risk-logs');
            setRiskLogs(logsRes.data);
            // Refresh depts
            const deptsRes = await api.get('/departments');
            setDepartments(deptsRes.data);
        } catch (error) {
            console.error("Simulation failed", error);
        }
    };

    // Prepare chart data
    const chartData = riskLogs.map(log => ({
        time: new Date(log.timestamp).toLocaleTimeString(),
        score: log.risk_score,
        dept: log.department
    })).reverse();

    if (loading) return <div className="p-8 text-center">Loading Risk Intelligence...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Simulation Button */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Brain className="text-indigo-600" />
                        Predictive Risk Analysis
                    </h2>
                    <p className="text-slate-500">AI-driven insights and anomaly detection.</p>
                </div>
                <button
                    onClick={simulateRisk}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all transform hover:scale-105"
                >
                    <TrendingUp size={18} />
                    Simulate Risk Event
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Insight Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Risk Trend Timeline</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickCount={5} />
                                    <YAxis stroke="#64748b" domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Department Risk Breakdown */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Department Risk Heatmap</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departments}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                    <Bar dataKey="risk_score" radius={[4, 4, 0, 0]}>
                                        {departments.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.risk_score > 70 ? '#ef4444' : entry.risk_score > 40 ? '#f59e0b' : '#10b981'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Explanations & SHAP */}
                <div className="space-y-6">
                    {/* Live Insight Card */}
                    {aiInsight ? (
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 animate-slide-in">
                            <div className="flex items-center justify-between mb-4">
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <Brain size={12} /> AI GENERATED
                                </span>
                                <span className="text-sm text-slate-400">Just now</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{aiInsight.department} Risk Spike</h3>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-600">{aiInsight.new_score}</div>
                                    <div className="text-xs text-slate-500">New Score</div>
                                </div>
                                <div className="border-l border-slate-200 h-8"></div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{aiInsight.confidence}%</div>
                                    <div className="text-xs text-slate-500">Confidence</div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg mb-4">
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    "{aiInsight.explanation}"
                                </p>
                            </div>

                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Feature Contribution (SHAP)</h4>
                            <div className="space-y-2">
                                {aiInsight.shap_values.slice(0, 3).map((shap, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">{shap.feature}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-indigo-500 h-full rounded-full"
                                                    style={{ width: `${Math.min(100, (shap.impact / 20) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-mono text-xs text-indigo-600">+{Math.round(shap.impact)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center h-full flex flex-col justify-center items-center opacity-70">
                            <Brain size={48} className="text-slate-200 mb-4" />
                            <h3 className="text-lg font-medium text-slate-400">No Analysis Selected</h3>
                            <p className="text-sm text-slate-400 mt-2">Run a simulation to generate AI insights.</p>
                        </div>
                    )}

                    {/* Action Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-6 rounded-xl shadow-lg text-white">
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <CheckCircle size={18} className="text-green-400" />
                            Recommended Actions
                        </h3>
                        <ul className="text-sm space-y-3 text-indigo-100">
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></span>
                                Audit recent vendor invoices for anomalies.
                            </li>
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></span>
                                Schedule review with finance regarding payroll variance.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskAnalysis;
