import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DepartmentListComponent from '../components/DepartmentList';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await api.get('/departments');
                setDepartments(res.data);
            } catch (error) {
                console.error("Failed to fetch departments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDepts();
    }, []);

    if (loading) return <div className="p-8 text-center animate-pulse text-slate-400">Loading Departments...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">Departments Overview</h2>
            <div className="h-[600px]">
                <DepartmentListComponent departments={departments} />
            </div>
        </div>
    );
};

export default DepartmentList;
