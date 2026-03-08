import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Helper to get prefix
const getPortalPrefix = () => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin_';
    if (path.startsWith('/hr')) return 'hr_';
    return 'intern_';
};

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
    // If the request explicitly has an Authorization header (like from verifySession), use it.
    if (!config.headers.Authorization) {
        const prefix = getPortalPrefix();
        const token = localStorage.getItem(`${prefix}token`);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor for auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const prefix = getPortalPrefix();
            localStorage.removeItem(`${prefix}token`);
            localStorage.removeItem(`${prefix}user`);

            // Redirect based on current portal
            if (prefix === 'admin_' || prefix === 'hr_') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
