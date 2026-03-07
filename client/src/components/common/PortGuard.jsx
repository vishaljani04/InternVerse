import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PortGuard = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const port = window.location.port;
    const path = location.pathname;

    useEffect(() => {
        // Intern Port (5173)
        if (port === '5173') {
            const isStaffPath = path.startsWith('/hr') || path.startsWith('/admin/manage');
            const isRoot = path === '/';

            if (isStaffPath || isRoot) {
                navigate('/internships', { replace: true });
            }
        }

        // HR Port (5174)
        else if (port === '5174') {
            const isInternPath = path === '/internships' || path.startsWith('/internships/') || path === '/login' || path === '/signup' || path.startsWith('/intern/');
            const isRoot = path === '/';
            const isAdminSpecific = path.startsWith('/admin/manage');

            if (isInternPath || isRoot || isAdminSpecific) {
                // If they are logged in as HR, maybe go to dashboard, otherwise /admin (login)
                navigate('/admin', { replace: true });
            }
        }

        // Admin Port (5175)
        else if (port === '5175') {
            const isInternPath = path === '/internships' || path.startsWith('/internships/') || path === '/login' || path === '/signup' || path.startsWith('/intern/');
            const isRoot = path === '/';
            const isHRSpecific = path.startsWith('/hr');

            if (isInternPath || isRoot || isHRSpecific) {
                navigate('/admin', { replace: true });
            }
        }
    }, [path, port, navigate]);

    return children;
};

export default PortGuard;
