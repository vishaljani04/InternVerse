import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            logout(); // Clear any existing session before login
            const data = await login(email, password);
            if (data.success) {
                const role = data.user.role;
                if (role === 'admin' || role === 'hr') {
                    // Admin/HR should not login here
                    setError('This login is for interns only. Admin/HR please use the admin login.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setLoading(false);
                    return;
                }
                navigate('/internships');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-300 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-white/20">
                        <BarChart3 size={40} className="text-white" />
                    </div>

                    <h1 className="text-5xl font-bold mb-4 text-center">InternVerse</h1>
                    <p className="text-xl text-primary-100 mb-8 text-center max-w-md">
                        Your gateway to amazing internship opportunities
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                        {[
                            { label: 'Apply Easily', value: 'One-Click Apply' },
                            { label: 'Track Status', value: 'Real-time Updates' },
                            { label: 'Certificates', value: 'Auto Generate' },
                            { label: 'Build Skills', value: 'Grow Your Career' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <p className="text-xs text-primary-200 mb-1">{item.label}</p>
                                <p className="text-sm font-semibold">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side - login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-50">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                            <BarChart3 size={20} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-surface-900">InternVerse</h1>
                    </div>

                    <h2 className="text-3xl font-bold text-surface-900 mb-2">Welcome back</h2>
                    <p className="text-surface-500 mb-8">Sign in to your intern account</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm animate-slide-up">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-2">Email Address</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="input-field pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-surface-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Sign Up
                        </Link>
                    </p>
                    <p className="text-center text-sm text-surface-400 mt-2">
                        <Link to="/internships" className="text-primary-500 hover:text-primary-600 font-medium">
                            Browse Internships →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
