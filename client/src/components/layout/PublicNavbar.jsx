import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import NotificationBell from '../common/NotificationBell';

const PublicNavbar = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-200 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link to="/internships" className="transition-transform hover:scale-[1.02]">
                    <Logo size={28} />
                </Link>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <NotificationBell />
                            <Link
                                to={user?.role === 'intern' ? '/intern/profile' : user?.role === 'hr' ? '/hr/dashboard' : '/admin/manage/dashboard'}
                                className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-primary-100 hover:border-primary-200"
                            >
                                <UserCircle size={20} />
                                <span className="hidden sm:inline">{user?.role === 'intern' ? 'My Profile' : 'Dashboard'}</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-sm font-semibold text-surface-600 hover:text-primary-600 px-4 py-2 rounded-xl hover:bg-surface-50 transition-colors">Sign In</Link>
                            <Link to="/signup" className="btn-primary text-sm !shadow-glow px-6 py-2.5">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
