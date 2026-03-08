import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get prefix based on current portal path
    const getPortalPrefix = () => {
        const path = window.location.pathname;
        if (path.startsWith('/admin')) return 'admin_';
        if (path.startsWith('/hr')) return 'hr_';
        return 'intern_';
    };

    useEffect(() => {
        const verifySession = async () => {
            const prefix = getPortalPrefix();
            const token = localStorage.getItem(`${prefix}token`);
            const savedUser = localStorage.getItem(`${prefix}user`);

            if (!token || !savedUser) {
                setLoading(false);
                return;
            }

            try {
                // Verify token with backend
                const { data } = await api.get('/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}` // Ensure we use the correct token for verification
                    }
                });
                
                if (data.success && data.user) {
                    const userData = { ...data.user };
                    localStorage.setItem(`${prefix}user`, JSON.stringify(userData));
                    setUser(userData);
                } else {
                    // Invalid token
                    localStorage.removeItem(`${prefix}token`);
                    localStorage.removeItem(`${prefix}user`);
                    setUser(null);
                }
            } catch {
                // Token expired or invalid
                localStorage.removeItem(`${prefix}token`);
                localStorage.removeItem(`${prefix}user`);
                setUser(null);
            }
            setLoading(false);
        };

        verifySession();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.success) {
            const role = data.user.role;
            const prefix = role === 'admin' ? 'admin_' : role === 'hr' ? 'hr_' : 'intern_';
            localStorage.setItem(`${prefix}token`, data.token);
            localStorage.setItem(`${prefix}user`, JSON.stringify(data.user));
            setUser(data.user);
        }
        return data;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        if (data.success) {
            const role = data.user.role;
            const prefix = role === 'admin' ? 'admin_' : role === 'hr' ? 'hr_' : 'intern_';
            localStorage.setItem(`${prefix}token`, data.token);
            localStorage.setItem(`${prefix}user`, JSON.stringify(data.user));
            setUser(data.user);
        }
        return data;
    };

    const logout = () => {
        const currentPrefix = getPortalPrefix();
        localStorage.removeItem(`${currentPrefix}token`);
        localStorage.removeItem(`${currentPrefix}user`);
        
        // Also wipe user state's role prefix to be safe if it mismatches portal
        if (user?.role) {
            const userPrefix = user.role === 'admin' ? 'admin_' : user.role === 'hr' ? 'hr_' : 'intern_';
            localStorage.removeItem(`${userPrefix}token`);
            localStorage.removeItem(`${userPrefix}user`);
        }
        
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';
    const isHR = user?.role === 'hr';
    const isIntern = user?.role === 'intern';

    return (
        <AuthContext.Provider value={{
            user, loading, login, register, logout,
            isAdmin, isHR, isIntern, isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};
