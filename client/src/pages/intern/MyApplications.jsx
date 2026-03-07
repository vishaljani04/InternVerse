import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, MapPin, Clock, DollarSign, Calendar, ChevronRight, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/applications/my');
            if (data.success) {
                setApplications(data.applications);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted':
                return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', icon: CheckCircle, label: 'Accepted' };
            case 'rejected':
                return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', icon: XCircle, label: 'Rejected' };
            case 'shortlisted':
                return { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', icon: AlertCircle, label: 'Shortlisted' };
            default:
                return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', icon: Clock, label: 'Pending' };
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                <p className="text-surface-500 animate-pulse">Loading your applications...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">My Applications</h1>
                <p className="text-surface-500">Track the status of your internship applications</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                    <XCircle size={20} />
                    <p className="font-medium text-sm">{error}</p>
                </div>
            )}

            {applications.length === 0 ? (
                <div className="glass-card p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase size={32} className="text-surface-400" />
                    </div>
                    <h3 className="text-xl font-bold text-surface-800">No applications yet</h3>
                    <p className="text-surface-500 max-w-sm mx-auto">You haven't applied for any internships. Start your journey by exploring available opportunities!</p>
                    <Link to="/internships" className="btn-primary inline-flex items-center gap-2 mt-4">
                        Browse Internships
                        <ChevronRight size={18} />
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {applications.map((app) => {
                        const style = getStatusStyle(app.status);
                        const StatusIcon = style.icon;
                        const listing = app.listingId;

                        return (
                            <div key={app._id} className="glass-card group hover:shadow-card-hover transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-100">
                                                <Briefcase size={24} className="text-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold text-surface-900 group-hover:text-primary-600 transition-colors">
                                                    {listing?.title || 'Unknown Position'}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-surface-500">
                                                    <span className="font-semibold text-primary-600">{listing?.company || 'InternVerse'}</span>
                                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {listing?.location || 'Remote'}</span>
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${style.bg} ${style.border} ${style.text}`}>
                                                <StatusIcon size={18} />
                                                <span className="text-sm font-bold uppercase tracking-wider">{style.label}</span>
                                            </div>

                                            <Link
                                                to={`/internships/${listing?._id}`}
                                                className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                title="View Internship Details"
                                            >
                                                <ChevronRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyApplications;
