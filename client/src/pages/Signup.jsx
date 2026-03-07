import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';

const Signup = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const data = await register({
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
                role: 'intern'
            });
            if (data.success) {
                navigate('/internships');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-primary-700 to-primary-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-32 left-20 w-96 h-96 bg-accent-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-white/20">
                        <BarChart3 size={40} className="text-white" />
                    </div>

                    <h1 className="text-5xl font-bold mb-4 text-center">Join InternVerse</h1>
                    <p className="text-xl text-primary-100 mb-8 text-center max-w-md">
                        Find your dream internship and kickstart your career
                    </p>

                    <div className="space-y-4 w-full max-w-sm">
                        {[
                            '🔍 Discover internships across departments',
                            '📄 Apply with your resume in one click',
                            '📊 Track your application status in real-time',
                            '🎓 Get certificates upon completion'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                <span className="text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side - signup form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-50">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="lg:hidden flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                            <BarChart3 size={20} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-surface-900">InternVerse</h1>
                    </div>

                    <h2 className="text-3xl font-bold text-surface-900 mb-2">Create Account</h2>
                    <p className="text-surface-500 mb-6">Sign up to browse and apply for internships</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm animate-slide-up">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Full Name *</label>
                            <input id="signup-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="rahul verma" className="input-field" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Email Address *</label>
                            <input id="signup-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="rahul@example.com" className="input-field" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Phone Number</label>
                            <input id="signup-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                placeholder="+91 98765 43210" className="input-field" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Password *</label>
                            <div className="relative">
                                <input id="signup-password" type={showPassword ? 'text' : 'password'} value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="Min 6 characters" className="input-field pr-12" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Confirm Password *</label>
                            <input id="signup-confirm" type="password" value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                placeholder="Confirm your password" className="input-field" required />
                        </div>

                        <button id="signup-submit" type="submit" disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <UserPlus size={18} /> Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-surface-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
