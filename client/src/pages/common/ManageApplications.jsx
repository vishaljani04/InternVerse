import { useState, useEffect } from 'react';
import {
    Search, Filter, Calendar, Mail, Phone,
    Download, CheckCircle, XCircle, Clock,
    MoreVertical, User, Briefcase, GraduationCap,
    FileText, ExternalLink, MessageSquare
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [updating, setUpdating] = useState(false);
    const { user } = useAuth();

    useEffect(() => { fetchApplications(); }, [filterStatus]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filterStatus) params.status = filterStatus;
            const { data } = await api.get('/applications', { params });
            setApplications(data.applications || []);
        } catch (err) {
            console.error('Error fetching applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            setUpdating(true);
            const { data } = await api.patch(`/applications/${id}/status`, {
                status,
                adminNotes
            });
            if (data.success) {
                setApplications(prev => prev.map(app => app._id === id ? data.application : app));
                setIsModalOpen(false);
                setAdminNotes('');
            }
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'shortlisted': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
            case 'reviewed': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            default: return 'bg-surface-50 text-surface-600 border-surface-200';
        }
    };

    const filteredApplications = applications.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.listingId?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openDetails = (app) => {
        setSelectedApp(app);
        setAdminNotes(app.adminNotes || '');
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Manage Applications</h1>
                    <p className="text-surface-500 text-sm">Review and manage internship applications</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search applicants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {['', 'pending', 'shortlisted', 'accepted', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${filterStatus === status
                                ? 'bg-primary-600 text-white border-primary-600 shadow-glow'
                                : 'bg-white text-surface-500 border-surface-200 hover:border-primary-300'
                            }`}
                    >
                        {status || 'All Applications'}
                    </button>
                ))}
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-3xl border border-surface-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-50 border-b border-surface-200 font-bold text-xs uppercase text-surface-500 tracking-wider">
                                <th className="px-6 py-4">Applicant</th>
                                <th className="px-6 py-4">Position</th>
                                <th className="px-6 py-4">Applied Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4 bg-surface-50/50 h-16"></td>
                                    </tr>
                                ))
                            ) : filteredApplications.length > 0 ? (
                                filteredApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-primary-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                                                    {app.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-surface-900 text-sm">{app.name}</p>
                                                    <p className="text-xs text-surface-400">{app.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-surface-800 text-sm">{app.listingId?.title}</p>
                                                <p className="text-xs text-surface-400">{app.listingId?.company}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-surface-500 text-xs">
                                                <Calendar size={14} />
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openDetails(app)}
                                                className="p-2 hover:bg-primary-100 text-primary-600 rounded-xl transition-colors"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-surface-400">
                                        <div className="flex flex-col items-center">
                                            <FileText size={48} className="mb-4 opacity-20" />
                                            <p className="font-bold text-lg">No applications found</p>
                                            <p className="text-sm">Try adjusting your filters or search term</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Details Modal */}
            {isModalOpen && selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                        <div className="p-6 bg-surface-50 border-b border-surface-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary-200">
                                    {selectedApp.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-surface-900">{selectedApp.name}</h2>
                                    <p className="text-surface-500 text-sm">Application for {selectedApp.listingId?.title}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-200 rounded-xl transition-colors">
                                <XCircle size={24} className="text-surface-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Column: Info */}
                                <div className="space-y-6 md:col-span-2">
                                    <div>
                                        <h3 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-4">Contact Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-surface-50 rounded-2xl border border-surface-100">
                                                <div className="flex items-center gap-2 text-primary-600 mb-1">
                                                    <Mail size={16} /> <span className="text-[10px] font-bold uppercase uppercase tracking-wider">Email</span>
                                                </div>
                                                <p className="text-sm font-semibold text-surface-800 break-all">{selectedApp.email}</p>
                                            </div>
                                            <div className="p-4 bg-surface-50 rounded-2xl border border-surface-100">
                                                <div className="flex items-center gap-2 text-primary-600 mb-1">
                                                    <Phone size={16} /> <span className="text-[10px] font-bold uppercase uppercase tracking-wider">Phone</span>
                                                </div>
                                                <p className="text-sm font-semibold text-surface-800">{selectedApp.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-4">Education & Background</h3>
                                        <div className="p-6 bg-surface-50 rounded-2xl border border-surface-100 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-surface-200 flex items-center justify-center text-primary-500">
                                                    <GraduationCap size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">University / College</p>
                                                    <p className="text-sm font-semibold text-surface-900">{selectedApp.university || 'Not specified'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedApp.applicantId?.skills?.length > 0 ? selectedApp.applicantId.skills.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1 bg-white border border-surface-200 text-surface-600 text-[11px] font-bold rounded-lg uppercase">
                                                            {skill}
                                                        </span>
                                                    )) : (
                                                        <span className="text-sm text-surface-500 italic">No skills listed</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-4">Cover Letter / Statement</h3>
                                        <div className="p-6 bg-white border border-surface-200 rounded-2xl italic text-surface-600 text-sm leading-relaxed whitespace-pre-line">
                                            {selectedApp.coverLetter || 'No cover letter provided.'}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Status & Actions */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-4">Resume</h3>
                                        {selectedApp.resumePath ? (
                                            <a
                                                href={`http://localhost:5000${selectedApp.resumePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-2xl hover:shadow-lg transition-transform hover:-translate-y-1 group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-primary-100">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-primary-700">View Resume</p>
                                                        <p className="text-[10px] text-primary-400 uppercase tracking-widest font-bold font-bold">PDF / Word</p>
                                                    </div>
                                                </div>
                                                <Download size={18} className="text-primary-500 group-hover:scale-125 transition-transform" />
                                            </a>
                                        ) : (
                                            <div className="p-4 bg-surface-50 border border-surface-200 border-dashed rounded-2xl text-center">
                                                <p className="text-xs font-bold text-surface-400 italic">No resume uploaded</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 bg-surface-50 border border-surface-200 rounded-3xl space-y-4">
                                        <h3 className="text-sm font-bold text-surface-900 border-b border-surface-200 pb-3">Review Application</h3>

                                        <div>
                                            <label className="block text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-2">Internal Notes</label>
                                            <textarea
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                placeholder="Add notes for the team or for the candidate's email..."
                                                className="w-full h-24 px-3 py-2 bg-white border border-surface-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-4"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(selectedApp._id, 'shortlisted')}
                                                disabled={updating}
                                                className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={16} /> Shortlist Candidate
                                            </button>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedApp._id, 'accepted')}
                                                    disabled={updating}
                                                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedApp._id, 'rejected')}
                                                    disabled={updating}
                                                    className="w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-surface-400 text-center uppercase tracking-widest font-bold">Candidate will be notified via email on status update</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageApplications;
