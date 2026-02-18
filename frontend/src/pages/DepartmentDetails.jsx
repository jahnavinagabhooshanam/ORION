import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ArrowLeft, AlertTriangle, TrendingDown, CheckSquare } from 'lucide-react';

const DepartmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dept, setDept] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [deptRes, historyRes] = await Promise.all([
                    api.get(`/departments/${id}`),
                    api.get(`/departments/${id}/history`)
                ]);
                setDept(deptRes.data);
                setHistory(historyRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch department details", error);
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading Department Intelligence...</div>;
    if (!dept) return <div className="p-8 text-center">Department not found.</div>;

    // Prepare Radar Data
    const radarData = [
        { subject: 'Finance', A: dept.details.finance, fullMark: 100 },
        { subject: 'HR', A: dept.details.hr, fullMark: 100 },
        { subject: 'CRM', A: dept.details.crm, fullMark: 100 },
        { subject: 'Vendor', A: dept.details.vendor, fullMark: 100 },
        { subject: 'Support', A: dept.details.support, fullMark: 100 },
    ];

    // Prepare History Data
    const historyData = history.map(h => ({
        time: new Date(h.timestamp).toLocaleDateString() + ' ' + new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        score: h.risk_score
    })).reverse();

    return (
        <div className="space-y-6 animate-fade-in">
            <button
                onClick={() => navigate('/departments')}
                className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
            >
                <ArrowLeft size={18} className="mr-1" /> Back to Departments
            </button>

            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">{dept.name} Department</h2>
                    <p className="text-slate-500">Risk Profile & Operational Analysis</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-400">Current Risk Score</div>
                    <div className={`text-4xl font-bold ${dept.risk_score > 70 ? 'text-red-500' : dept.risk_score > 40 ? 'text-amber-500' : 'text-green-500'}`}>
                        {dept.risk_score}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Component Radar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Risk Composition</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Risk Level" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk History Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Historical Trend</h3>
                    <div className="h-72">
                        {historyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Line type="step" dataKey="score" stroke="#f59e0b" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No history available yet.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Recommended Mitigation Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-slate-100 p-4 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
                            <CheckSquare size={18} />
                            <span>Immediate</span>
                        </div>
                        <p className="text-sm text-slate-600">Review {radarData.sort((a, b) => b.A - a.A)[0].subject} compliance logs for recent anomalies.</p>
                    </div>
                    <div className="border border-slate-100 p-4 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
                            <TrendingDown size={18} />
                            <span>Optimization</span>
                        </div>
                        <p className="text-sm text-slate-600">Implement automated auditing for vendor transactions to reduce volatility.</p>
                    </div>
                    <div className="border border-slate-100 p-4 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
                            <AlertTriangle size={18} />
                            <span>Monitoring</span>
                        </div>
                        <p className="text-sm text-slate-600">Set up hourly alerts for thresholds exceeding 65% risk score.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentDetails;
