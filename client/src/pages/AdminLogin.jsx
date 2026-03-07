import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Eye, EyeOff, ArrowRight, Zap, UserPlus } from 'lucide-react';

const AdminLogin = () => {
    const [mode, setMode] = useState('login'); // 'login' or 'hr-signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            logout(); // Clear any existing session before login
            const data = await login(email, password);
            if (data.success) {
                const role = data.user.role;
                if (role === 'admin') {
                    navigate('/admin/manage/dashboard');
                } else if (role === 'hr') {
                    navigate('/hr/dashboard');
                } else {
                    setError('Access denied. This login is for Admin/HR only.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleHRSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            logout(); // Clear any existing session before signup
            const data = await register({
                name,
                email,
                password,
                role: 'hr',
                department
            });
            if (data.success) {
                navigate('/hr/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setDepartment('');
        setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900 relative overflow-hidden p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md animate-fade-in">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                            <Zap size={32} className="text-white fill-current" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            {mode === 'login' ? 'Admin Panel' : 'HR Registration'}
                        </h1>
                        <p className="text-surface-400 text-sm">
                            {mode === 'login' ? 'Admin & HR Management Access' : 'Create your HR account'}
                        </p>
                    </div>

                    {/* Toggle tabs */}
                    <div className="flex bg-white/5 rounded-xl p-1 mb-6">
                        <button onClick={() => { setMode('login'); resetForm(); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-primary-500 text-white shadow-lg' : 'text-surface-400 hover:text-white'}`}>
                            Sign In
                        </button>
                        <button onClick={() => { setMode('hr-signup'); resetForm(); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'hr-signup' ? 'bg-primary-500 text-white shadow-lg' : 'text-surface-400 hover:text-white'}`}>
                            HR Sign Up
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {mode === 'login' ? (
                        /* Login Form */
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-1.5">Email</label>
                                <input id="admin-login-email" type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@company.com"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                    required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-1.5">Password</label>
                                <div className="relative">
                                    <input id="admin-login-password" type={showPassword ? 'text' : 'password'} value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all pr-12"
                                        required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-300">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button id="admin-login-submit" type="submit" disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><ArrowRight size={18} /> Access Dashboard</>}
                            </button>
                        </form>
                    ) : (
                        /* HR Signup Form */
                        <form onSubmit={handleHRSignup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-1.5">Full Name *</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                    required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-1.5">Email *</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="hr@company.com"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                    required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-1.5">Department</label>
                                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)}
                                    placeholder="e.g., Human Resources"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-1.5">Password *</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all pr-12"
                                        required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-300">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><UserPlus size={18} /> Create HR Account</>}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                        <p className="text-surface-500 text-xs">Authorized personnel only</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
