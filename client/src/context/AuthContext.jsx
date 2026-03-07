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

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (!token || !savedUser) {
                setLoading(false);
                return;
            }

            try {
                // Verify token with backend
                const { data } = await api.get('/auth/profile');
                if (data.success && data.user) {
                    const userData = { ...data.user };
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                } else {
                    // Invalid token
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch {
                // Token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
            setLoading(false);
        };

        verifySession();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        }
        return data;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
