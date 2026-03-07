import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                    <p className="text-surface-500 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to the appropriate login page
        const path = window.location.pathname;
        if (path.startsWith('/admin') || path.startsWith('/hr')) {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Interns can't access admin/HR pages — send them to internships
        if (user.role === 'intern') {
            return <Navigate to="/internships" replace />;
        }
        return <Navigate to={`/${user.role === 'admin' ? 'admin' : 'hr'}/dashboard`} replace />;
    }

    return children;
};

export default ProtectedRoute;
