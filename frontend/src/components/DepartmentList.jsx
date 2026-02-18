import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DepartmentList = ({ departments }) => {
    const navigate = useNavigate();

    const getRiskColor = (score) => {
        if (score < 30) return "text-green-600 bg-green-50";
        if (score < 70) return "text-amber-600 bg-amber-50";
        return "text-red-600 bg-red-50";
    };

    const getBarColor = (score) => {
        if (score < 30) return "bg-green-500";
        if (score < 70) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-gray-100">
                <h3 className="text-gray-900 font-bold text-lg">Departmental Risk</h3>
                <p className="text-gray-500 text-xs mt-1">Real-time risk assessment by department</p>
            </div>

            <div className="overflow-y-auto flex-1 p-0">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 sticky top-0 text-gray-500 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">Components</th>
                            <th className="px-6 py-3 text-right">Risk Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {departments.map((dept, index) => (
                            <motion.tr
                                key={dept.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => navigate(`/departments/${dept.id}`)}
                                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {dept.name}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1 h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="bg-blue-400" style={{ width: `${dept.details.finance}%` }} title="Finance" />
                                        <div className="bg-purple-400" style={{ width: `${dept.details.hr}%` }} title="HR" />
                                        <div className="bg-indigo-400" style={{ width: `${dept.details.crm}%` }} title="CRM" />
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1 flex gap-2">
                                        <span>Fin: {Math.round(dept.details.finance)}</span>
                                        <span>HR: {Math.round(dept.details.hr)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${getBarColor(dept.risk_score)}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${dept.risk_score}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getRiskColor(dept.risk_score)}`}>
                                            {Math.round(dept.risk_score)}
                                        </span>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DepartmentList;
