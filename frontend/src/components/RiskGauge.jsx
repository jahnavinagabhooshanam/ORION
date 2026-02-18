import React from 'react';
import { motion } from 'framer-motion';

const RiskGauge = ({ score }) => {
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getColor = (s) => {
        if (s < 30) return "#2E7D32"; // Low (Green)
        if (s < 70) return "#FFB300"; // Medium (Amber)
        return "#E53935"; // High (Red)
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-gray-500 font-bold mb-4 uppercase tracking-wider text-xs">Total Enterprise Risk</h3>
            <div className="relative">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    <circle
                        stroke="#e2e8f0"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                    />
                    <motion.circle
                        stroke={getColor(score)}
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-800">{Math.round(score)}</span>
                    <span className="text-xs text-gray-400">/ 100</span>
                </div>
            </div>
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    Risk Level: <span className="font-bold" style={{ color: getColor(score) }}>
                        {score < 30 ? "Low" : score < 70 ? "Medium" : "Critical"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RiskGauge;
