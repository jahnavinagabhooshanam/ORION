import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AlertPanel = ({ alerts }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">Live Alerts</h3>
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    {alerts.length} Active
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar max-h-[300px]">
                {alerts.length === 0 ? (
                    <div className="text-center text-gray-400 py-8 text-sm">No active alerts</div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className="flex items-start p-3 bg-gray-50 rounded-lg border-l-4 border-l-transparent hover:border-l-primary transition-all">
                            <div className="mt-1 mr-3">
                                {alert.severity === 'High' ? (
                                    <AlertTriangle size={16} className="text-high-risk" />
                                ) : alert.severity === 'Medium' ? (
                                    <Clock size={16} className="text-medium-risk" />
                                ) : (
                                    <CheckCircle size={16} className="text-low-risk" />
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">{alert.department}</h4>
                                <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
                                <span className="text-[10px] text-gray-400 mt-2 block">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertPanel;
