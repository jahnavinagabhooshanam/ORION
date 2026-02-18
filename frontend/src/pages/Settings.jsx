import React, { useState } from 'react';
import { Save, User, Bell, Shield, Database, Globe } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
const SettingsCard = ({ title, subtitle, icon: LucideIcon, children }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <LucideIcon size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">{title}</h3>
                    <p className="text-sm text-slate-500">{subtitle}</p>
                </div>
            </div>
            <div className="pt-2">
                {children}
            </div>
        </div>
    );
};

const Settings = () => {
    const [notifications, setNotifications] = useState(true);
    const [aiEngine, setAiEngine] = useState(true);

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">System Settings</h2>
                    <p className="text-slate-500">Global configuration for the ORION Risk Intelligence Platform.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-900 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-colors shadow-md font-bold">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsCard
                    title="Profile Settings"
                    subtitle="Manage your administrative profile."
                    icon={User}
                >
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Email</label>
                            <input type="text" readOnly value="admin@orion.com" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg mt-1 text-slate-600 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                            <input type="text" defaultValue="Super Admin" className="w-full p-2 border border-slate-200 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                    </div>
                </SettingsCard>

                <SettingsCard
                    title="AI Risk Engine"
                    subtitle="Configure predictive model parameters."
                    icon={Shield}
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-700">Real-time Anomaly Detection</p>
                                <p className="text-xs text-slate-500">Automatically flag high-risk score shifts.</p>
                            </div>
                            <button
                                onClick={() => setAiEngine(!aiEngine)}
                                className={`w-12 h-6 rounded-full transition-colors ${aiEngine ? 'bg-indigo-600' : 'bg-slate-300'} relative`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${aiEngine ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alert Threshold (%)</label>
                            <input type="range" min="0" max="100" defaultValue="75" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2 accent-indigo-600 text-indigo-600" />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                                <span>Sensitive (50)</span>
                                <span>Aggressive (75)</span>
                                <span>Conservative (90)</span>
                            </div>
                        </div>
                    </div>
                </SettingsCard>

                <SettingsCard
                    title="Notifications"
                    subtitle="Manage how you receive critical alerts."
                    icon={Bell}
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-700">Email Notifications</p>
                                <p className="text-xs text-slate-500">Receive summaries of critical events.</p>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-indigo-600' : 'bg-slate-300'} relative`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </SettingsCard>

                <SettingsCard
                    title="Data Pipeline"
                    subtitle="Sync settings for organizational data."
                    icon={Database}
                >
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-start gap-2">
                            <Globe size={18} className="text-amber-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-amber-800">Connected Instance: ORION-EU-01</p>
                                <p className="text-xs text-amber-700">Last synced: 2 minutes ago</p>
                            </div>
                        </div>
                    </div>
                </SettingsCard>
            </div>
        </div>
    );
};

export default Settings;
