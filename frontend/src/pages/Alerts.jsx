import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Alerts = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, high, medium, low
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await api.get('/alerts');
            setAlerts(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch alerts", error);
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.put(`/alerts/${id}/resolve`);
            // Optimistic update
            setAlerts(prev => prev.map(a =>
                a.id === id ? { ...a, resolved: true } : a
            ));
        } catch (error) {
            console.error("Failed to resolve alert", error);
        }
    };

    const filteredAlerts = alerts.filter(alert => {
        const matchesFilter = filter === 'all' || alert.severity.toLowerCase() === filter;
        const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getSeverityColor = (severity) => {
        switch (severity.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading Alerts Control Center...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" />
                        Alert Management
                    </h2>
                    <p className="text-slate-500">Monitor and resolve system anomalies.</p>
                </div>
                <div className="flex gap-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                        {alerts.filter(a => !a.resolved && a.severity === 'High').length} Critical
                    </span>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                        {alerts.filter(a => !a.resolved && a.severity === 'Medium').length} Warning
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search alerts..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Severities</option>
                        <option value="high">High Only</option>
                        <option value="medium">Medium Only</option>
                    </select>
                </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {filteredAlerts.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            No alerts found matching your criteria.
                        </div>
                    ) : (
                        filteredAlerts.map(alert => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${alert.resolved ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white shadow-sm border-slate-100 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 w-2 h-12 rounded-full ${alert.resolved ? 'bg-slate-300' :
                                        alert.severity === 'High' ? 'bg-red-500' : 'bg-amber-500'
                                        }`}></div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getSeverityColor(alert.severity)}`}>
                                                {alert.severity}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(alert.timestamp).toLocaleString()}
                                            </span>
                                            {alert.resolved && (
                                                <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                                    <CheckCircle size={12} /> Resolved
                                                </span>
                                            )}
                                        </div>
                                        <p className={`font-medium ${alert.resolved ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                            {alert.message}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Department ID: {alert.department_id}
                                        </p>
                                    </div>
                                </div>

                                {!alert.resolved && user?.role !== 'Executive' && (
                                    <button
                                        onClick={() => handleResolve(alert.id)}
                                        className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        <CheckCircle size={16} className="text-green-500" />
                                        Resolve
                                    </button>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Alerts;
