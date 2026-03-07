import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Building, Save, ArrowLeft, Camera } from 'lucide-react';
import api from '../../services/api';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', department: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [passLoading, setPassLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                department: user.department || ''
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');
        try {
            const { data } = await api.put('/auth/profile', {
                name: form.name,
                phone: form.phone,
                department: form.department
            });
            if (data.success) {
                // Update local storage
                const updatedUser = { ...user, name: form.name, phone: form.phone, department: form.department };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setSuccess('Profile updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setPassLoading(true);
        try {
            const { data } = await api.put('/auth/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            if (data.success) {
                setSuccess('Password changed successfully!');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setPassLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
        if (!window.confirm('This will permanently delete all your data. Are you absolutely sure?')) return;

        try {
            await api.delete('/auth/account');
            logout();
            navigate('/internships');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete account');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-100 rounded-lg transition-colors">
                    <ArrowLeft size={20} className="text-surface-500" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-surface-900">My Profile</h1>
                    <p className="text-surface-500 mt-1">Manage your account details</p>
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-surface-900">{user?.name}</h2>
                        <p className="text-surface-500">{user?.email}</p>
                        <span className="badge badge-info mt-1 capitalize">{user?.role}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button onClick={() => { setActiveTab('profile'); setError(''); setSuccess(''); }}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-primary-500 text-white shadow-glow' : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'}`}>
                    Profile Details
                </button>
                <button onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'password' ? 'bg-primary-500 text-white shadow-glow' : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'}`}>
                    Change Password
                </button>
                <button onClick={() => { setActiveTab('danger'); setError(''); setSuccess(''); }}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'danger' ? 'bg-red-500 text-white' : 'bg-white text-red-500 hover:bg-red-50 border border-surface-200'}`}>
                    Danger Zone
                </button>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm animate-slide-up">{success}</div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-up">{error}</div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="glass-card p-6">
                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-1.5">
                                    <User size={14} /> Full Name
                                </label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-1.5">
                                    <Mail size={14} /> Email Address
                                </label>
                                <input type="email" value={form.email} className="input-field bg-surface-50 cursor-not-allowed" disabled />
                                <p className="text-xs text-surface-400 mt-1">Email cannot be changed</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-1.5">
                                    <Phone size={14} /> Phone Number
                                </label>
                                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="input-field" placeholder="+91 98765 43210" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-1.5">
                                    <Building size={14} /> Department
                                </label>
                                <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                                    className="input-field" placeholder="e.g., Engineering" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={loading}
                                className="btn-primary flex items-center gap-2 disabled:opacity-50">
                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={16} />}
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <div className="glass-card p-6">
                    <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1.5">Current Password</label>
                            <input type="password" value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1.5">New Password</label>
                            <input type="password" value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="input-field" required placeholder="Min 6 characters" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1.5">Confirm New Password</label>
                            <input type="password" value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="input-field" required />
                        </div>
                        <button type="submit" disabled={passLoading}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50">
                            {passLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={16} />}
                            {passLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
                <div className="glass-card p-6 border-2 border-red-100">
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Delete Account</h3>
                    <p className="text-sm text-surface-600 mb-4">
                        Once you delete your account, all your data including applications, tasks, and evaluations will be permanently removed. This action cannot be undone.
                    </p>
                    <button onClick={handleDeleteAccount}
                        className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">
                        Delete My Account
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
