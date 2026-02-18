import React from 'react';
import { LayoutDashboard, Activity, AlertTriangle, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-indigo-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
            }`}
        onClick={onClick}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </div>
);

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Quick role check helper
    const hasAccess = (item) => {
        if (!user) return false;
        if (user.role === 'Admin') return true;

        switch (item) {
            case 'dashboard': return true; // Everyone sees dashboard
            case 'analysis': return ['Risk Manager'].includes(user.role);
            case 'departments': return ['Department Head'].includes(user.role);
            case 'alerts': return ['Risk Manager', 'Executive'].includes(user.role);
            case 'settings': return false; // Only Admin (handled by early return)
            default: return false;
        }
    };

    const handleNavigate = (path) => {
        navigate(path === 'dashboard' ? '/' : `/${path}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Determine active item based on current path
    const getActivePage = () => {
        const path = location.pathname.substring(1); // remove leading slash
        if (path === '') return 'dashboard';
        if (path.startsWith('departments')) return 'departments';
        if (path.startsWith('analysis')) return 'analysis';
        if (path.startsWith('alerts')) return 'alerts';
        if (path.startsWith('settings')) return 'settings';
        return path;
    };

    const activePage = getActivePage();
    const isItemActive = (item) => activePage === item;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-xl z-20">
                <div className="p-6 flex items-center space-x-2 border-b border-gray-100">
                    <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white font-bold">O</span>
                    </div>
                    <span className="text-indigo-900 font-extrabold text-xl tracking-tight">ORION</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={isItemActive('dashboard')}
                        onClick={() => handleNavigate('dashboard')}
                    />

                    {hasAccess('analysis') && (
                        <SidebarItem
                            icon={Activity}
                            label="Risk Analysis"
                            active={isItemActive('analysis')}
                            onClick={() => handleNavigate('analysis')}
                        />
                    )}

                    {hasAccess('departments') && (
                        <SidebarItem
                            icon={Users}
                            label="Departments"
                            active={isItemActive('departments')}
                            onClick={() => handleNavigate('departments')}
                        />
                    )}

                    {hasAccess('alerts') && (
                        <SidebarItem
                            icon={AlertTriangle}
                            label="Alerts"
                            active={isItemActive('alerts')}
                            onClick={() => handleNavigate('alerts')}
                        />
                    )}

                    {hasAccess('settings') && (
                        <SidebarItem
                            icon={Settings}
                            label="Settings"
                            active={isItemActive('settings')}
                            onClick={() => handleNavigate('settings')}
                        />
                    )}
                </nav>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-800 truncate w-24">{user?.email?.split('@')[0]}</p>
                                <p className="text-xs text-indigo-600 font-medium">{user?.role}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800 capitalize">{activePage?.replace('-', ' ') || 'Dashboard'}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm text-gray-500 font-medium">System Operational</span>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
