import React, { useState, useEffect } from 'react';
import { getRiskSummary, getAlerts, getDepartments, simulateRiskEvent } from '../services/api';
import RiskGauge from '../components/RiskGauge';
import AlertPanel from '../components/AlertPanel';
import DepartmentList from '../components/DepartmentList';
import RiskChart from '../components/RiskChart';
import { Zap } from 'lucide-react';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([
        { time: '10:00', value: 45 },
        { time: '11:00', value: 48 },
        { time: '12:00', value: 46 },
        { time: '13:00', value: 52 },
        { time: '14:00', value: 49 },
    ]);

    const fetchData = async () => {
        try {
            const sumData = await getRiskSummary();
            const alertData = await getAlerts();
            const deptData = await getDepartments();

            if (sumData) {
                setSummary(sumData);
                // Append to history if needed, for now just keeping static mock + live updates
            }
            if (alertData) setAlerts(alertData);
            if (deptData) setDepartments(deptData);
        } catch (e) {
            console.error("Fetch error", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll every 5 seconds
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSimulate = async () => {
        const result = await simulateRiskEvent();
        if (result) {
            fetchData();
            // Add to history
            setHistory(prev => {
                const newHistory = [...prev.slice(1), {
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    value: Math.round(result.new_score)
                }];
                return newHistory;
            });
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="text-primary animate-pulse font-bold">Initializing ORION Risk Engine...</div>
        </div>
    );

    return (
        <div className="space-y-6 pb-8">
            {/* Top Stats & Controls */}
            <div className="flex flex-col md:flex-row gap-6 h-auto md:h-80">
                <div className="w-full md:w-1/3 h-80">
                    <RiskGauge score={summary?.total_risk || 0} />
                </div>
                <div className="w-full md:w-2/3 h-80">
                    <RiskChart data={history} />
                </div>
            </div>

            {/* Simulator Button (Demo Mode) */}
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div>
                    <h3 className="font-bold text-blue-900">Simulation Control</h3>
                    <p className="text-sm text-blue-700">Manually trigger risk events to test system response.</p>
                </div>
                <button
                    onClick={handleSimulate}
                    className="flex items-center space-x-2 bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent text-white px-6 py-3 rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all font-bold"
                >
                    <Zap size={20} />
                    <span>Simulate Event</span>
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <DepartmentList departments={departments} />
                </div>
                <div className="lg:col-span-1 h-[500px]">
                    <AlertPanel alerts={alerts} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
