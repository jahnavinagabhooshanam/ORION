import React from 'react';
import { AlertTriangle, Info, CheckCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertFeed = ({ alerts }) => {

    const getIcon = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'medium': return <Info className="w-4 h-4 text-amber-500" />;
            default: return <Bell className="w-4 h-4 text-blue-500" />;
        }
    };

    const getBgColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high': return 'bg-red-50 border-red-100';
            case 'medium': return 'bg-amber-50 border-amber-100';
            default: return 'bg-blue-50 border-blue-100';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-gray-900 font-bold text-lg">Live Alerts</h3>
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                    {alerts.length === 0 ? (
                        <div className="text-center text-gray-400 py-10 text-sm">
                            <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            No active alerts
                        </div>
                    ) : (
                        alerts.map((alert, index) => (
                            <motion.div
                                key={alert.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-3 rounded-lg border ${getBgColor(alert.severity)} flex gap-3 items-start`}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {getIcon(alert.severity)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AlertFeed;
