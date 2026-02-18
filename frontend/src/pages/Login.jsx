import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid credentials');
        }
    };

    // Demo helper
    const setDemoUser = (role) => {
        if (role === 'admin') { setEmail('admin@orion.com'); setPassword('admin'); }
        if (role === 'risk') { setEmail('risk@orion.com'); setPassword('risk'); }
        if (role === 'dept') { setEmail('dept@orion.com'); setPassword('dept'); }
        if (role === 'exec') { setEmail('exec@orion.com'); setPassword('exec'); }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-50">
            <div className="flex flex-col justify-center items-center p-8 bg-white shadow-xl z-10">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Sign in to ORION</h2>
                        <p className="mt-2 text-sm text-slate-600">Enterprise Risk Intelligence Platform</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    className="appearance-none rounded-none rounded-t-md relative block w-full px-10 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    className="appearance-none rounded-none rounded-b-md relative block w-full px-10 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Quick Demo Login</span>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button onClick={() => setDemoUser('admin')} className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-xs font-bold text-slate-600 hover:bg-slate-50">Admin</button>
                            <button onClick={() => setDemoUser('risk')} className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-xs font-bold text-slate-600 hover:bg-slate-50">Risk Manager</button>
                            <button onClick={() => setDemoUser('dept')} className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-xs font-bold text-slate-600 hover:bg-slate-50">Dept Head</button>
                            <button onClick={() => setDemoUser('exec')} className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-xs font-bold text-slate-600 hover:bg-slate-50">Executive</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden md:block relative bg-indigo-900">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90"></div>
                <div className="relative h-full flex flex-col justify-center items-center text-white p-12 text-center">
                    <h1 className="text-4xl font-bold mb-6">Organizational Risk Intelligence</h1>
                    <p className="text-lg text-indigo-200">Predict, Analyze, and Mitigate Operational Risks with AI.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
