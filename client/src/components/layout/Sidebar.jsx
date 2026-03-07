import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, ListTodo, Star, Award, Settings,
    LogOut, ChevronLeft, ChevronRight, Menu, X, UserCircle,
    Zap, UserPlus, ClipboardList, Briefcase, FileText, TrendingUp, Globe
} from 'lucide-react';
import NotificationBell from '../common/NotificationBell';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        const role = user?.role;
        logout();
        navigate(role === 'admin' || role === 'hr' ? '/admin' : '/login');
    };

    const adminLinks = [
        { to: '/admin/manage/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/manage/listings', icon: Briefcase, label: 'Listings' },
        { to: '/admin/manage/tasks', icon: ListTodo, label: 'Tasks' },
        { to: '/admin/manage/evaluations', icon: Star, label: 'Evaluations' },
        { to: '/admin/manage/certificates', icon: Award, label: 'Certificates' },
        { to: '/admin/manage/users', icon: UserPlus, label: 'Users' },
        { to: '/admin/manage/applications', icon: FileText, label: 'Applications' },
    ];

    const hrLinks = [
        { to: '/hr/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/hr/listings', icon: Briefcase, label: 'Listings' },
        { to: '/hr/tasks', icon: ListTodo, label: 'Tasks' },
        { to: '/hr/evaluations', icon: Star, label: 'Evaluations' },
        { to: '/hr/certificates', icon: Award, label: 'Certificates' },
        { to: '/hr/applications', icon: FileText, label: 'Applications' },
    ];

    const internLinks = [
        { to: '/internships', icon: Globe, label: 'Explore Internships' },
        { to: '/intern/profile', icon: UserCircle, label: 'My Profile' },
        { to: '/intern/applications', icon: Briefcase, label: 'My Applications' },
        { to: '/intern/tasks', icon: ListTodo, label: 'My Tasks' },
        { to: '/intern/performance', icon: TrendingUp, label: 'My Performance' },
    ];

    const links = user?.role === 'admin' ? adminLinks : user?.role === 'hr' ? hrLinks : internLinks;

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive(to)
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow'
                    : 'text-surface-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
        >
            <Icon size={20} className={`flex-shrink-0 ${isActive(to) ? '' : 'group-hover:scale-110'} transition-transform`} />
            {!collapsed && <span className="font-medium text-sm">{label}</span>}
        </Link>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-card"
                id="sidebar-toggle"
            >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white border-r border-surface-200 z-40 transition-all duration-300 flex flex-col
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-surface-100">
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-100">
                                <Zap size={20} className="text-white fill-current" />
                            </div>
                            <div>
                                <h1 className="font-bold text-surface-900 text-sm">InternVerse</h1>
                                <p className="text-[10px] text-surface-400 uppercase tracking-wider">Management</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition-colors"
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                    {!collapsed && <NotificationBell />}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {!collapsed && (
                        <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider px-4 py-2">
                            Navigation
                        </p>
                    )}
                    {links.map((link) => (
                        <NavLink key={link.to} {...link} />
                    ))}
                </nav>

                {/* User section */}
                <div className="p-3 border-t border-surface-100">
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2`}>
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-surface-800 truncate">{user?.name}</p>
                                <p className="text-xs text-surface-400 capitalize">{user?.role}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 mt-1 rounded-xl text-red-500 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
                        id="logout-button"
                    >
                        <LogOut size={18} />
                        {!collapsed && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
