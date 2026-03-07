import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, Users, Calendar, ArrowLeft, CheckCircle, Upload } from 'lucide-react';
import Modal from '../components/common/Modal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../components/layout/PublicNavbar';

const InternshipDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applying, setApplying] = useState(false);
    const [applyForm, setApplyForm] = useState({ coverLetter: '', skills: '', university: '', phone: '' });
    const [resumeFile, setResumeFile] = useState(null);
    const [applySuccess, setApplySuccess] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'hr') {
                navigate('/hr/dashboard');
            } else if (user?.role === 'admin') {
                navigate('/admin/manage/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        fetchListing();
        if (isAuthenticated) checkIfApplied();
    }, [id, isAuthenticated]);

    const fetchListing = async () => {
        try {
            const { data } = await api.get(`/listings/public/${id}`);
            setListing(data.listing);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const checkIfApplied = async () => {
        try {
            const { data } = await api.get(`/applications/check/${id}`);
            setHasApplied(data.hasApplied);
        } catch (err) { console.error(err); }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        try {
            const formData = new FormData();
            formData.append('listingId', id);
            formData.append('coverLetter', applyForm.coverLetter);
            formData.append('skills', applyForm.skills);
            formData.append('university', applyForm.university);
            formData.append('phone', applyForm.phone);
            if (resumeFile) formData.append('resume', resumeFile);

            await api.post('/applications/apply', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setApplySuccess(true);
            setHasApplied(true);
            setTimeout(() => setShowApplyModal(false), 2000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    const typeLabel = (t) => {
        switch (t) {
            case 'remote': return { text: 'Remote', color: 'badge-success' };
            case 'onsite': return { text: 'On-site', color: 'badge-info' };
            case 'hybrid': return { text: 'Hybrid', color: 'badge-purple' };
            default: return { text: t, color: 'badge-info' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-surface-800 mb-2">Internship Not Found</h2>
                    <Link to="/internships" className="text-primary-600 hover:text-primary-700 font-medium">← Back to listings</Link>
                </div>
            </div>
        );
    }

    const tp = typeLabel(listing.type);

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Top bar */}
            <PublicNavbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6 animate-fade-in">
                        <div className="glass-card p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-accent-400 rounded-2xl flex items-center justify-center">
                                        <Briefcase size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-surface-900">{listing.title}</h1>
                                        <p className="text-primary-600 font-semibold">{listing.company}</p>
                                    </div>
                                </div>
                                <span className={`badge ${tp.color}`}>{tp.text}</span>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-6 text-sm text-surface-500">
                                <span className="flex items-center gap-1.5"><MapPin size={15} /> {listing.location}</span>
                                <span className="flex items-center gap-1.5"><Clock size={15} /> {listing.duration}</span>
                                <span className="flex items-center gap-1.5"><DollarSign size={15} /> {listing.stipend}</span>
                                <span className="flex items-center gap-1.5"><Users size={15} /> {listing.openings} opening{listing.openings > 1 ? 's' : ''}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={15} /> Deadline: {new Date(listing.deadline).toLocaleDateString()}</span>
                            </div>

                            {listing.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {listing.skills.map((s, i) => (
                                        <span key={i} className="px-3 py-1 bg-primary-50 text-primary-600 text-sm rounded-lg font-medium">{s}</span>
                                    ))}
                                </div>
                            )}

                            <div className="border-t border-surface-100 pt-6">
                                <h3 className="text-lg font-semibold text-surface-800 mb-3">Description</h3>
                                <p className="text-surface-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
                            </div>

                            {listing.responsibilities && (
                                <div className="border-t border-surface-100 pt-6 mt-6">
                                    <h3 className="text-lg font-semibold text-surface-800 mb-3">Responsibilities</h3>
                                    <p className="text-surface-600 leading-relaxed whitespace-pre-line">{listing.responsibilities}</p>
                                </div>
                            )}

                            {listing.requirements && (
                                <div className="border-t border-surface-100 pt-6 mt-6">
                                    <h3 className="text-lg font-semibold text-surface-800 mb-3">Requirements</h3>
                                    <p className="text-surface-600 leading-relaxed whitespace-pre-line">{listing.requirements}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 animate-slide-up">
                        <div className="glass-card p-6 sticky top-24">
                            <h3 className="font-semibold text-surface-800 mb-4">Apply for this Internship</h3>

                            {hasApplied ? (
                                <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-xl text-emerald-700">
                                    <CheckCircle size={18} />
                                    <span className="font-medium text-sm">You've already applied!</span>
                                </div>
                            ) : !isAuthenticated ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-surface-500">Create an account or sign in to apply</p>
                                    <Link to="/signup" className="btn-primary w-full block text-center">Sign Up to Apply</Link>
                                    <Link to="/login" className="btn-secondary w-full block text-center">Sign In</Link>
                                </div>
                            ) : user?.role !== 'intern' ? (
                                <div className="p-4 bg-surface-100 rounded-xl text-surface-600 text-center">
                                    <p className="text-sm font-medium">Managers cannot apply for internships.</p>
                                    <p className="text-[10px] uppercase mt-1">Please use an intern account.</p>
                                </div>
                            ) : (
                                <button onClick={() => setShowApplyModal(true)}
                                    className="btn-primary w-full" id="apply-btn">
                                    Apply Now
                                </button>
                            )}

                            <div className="mt-6 pt-4 border-t border-surface-100 space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-surface-500">Department</span><span className="font-medium text-surface-700">{listing.department}</span></div>
                                <div className="flex justify-between"><span className="text-surface-500">Type</span><span className="font-medium text-surface-700 capitalize">{listing.type}</span></div>
                                <div className="flex justify-between"><span className="text-surface-500">Stipend</span><span className="font-medium text-surface-700">{listing.stipend}</span></div>
                                <div className="flex justify-between"><span className="text-surface-500">Openings</span><span className="font-medium text-surface-700">{listing.openings}</span></div>
                                <div className="flex justify-between"><span className="text-surface-500">Posted</span><span className="font-medium text-surface-700">{new Date(listing.createdAt).toLocaleDateString()}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            <Modal isOpen={showApplyModal} onClose={() => { setShowApplyModal(false); setApplySuccess(false); }} title="Apply for Internship" size="lg">
                {applySuccess ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 mb-2">Application Submitted!</h3>
                        <p className="text-surface-500">We'll review your application and get back to you.</p>
                    </div>
                ) : (
                    <form onSubmit={handleApply} className="space-y-4">
                        <div className="bg-surface-50 rounded-xl p-4">
                            <p className="text-sm font-medium text-surface-800">Applying for: <strong>{listing.title}</strong> at {listing.company}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Upload Resume (PDF) *</label>
                            <div className="border-2 border-dashed border-surface-200 rounded-xl p-4 text-center hover:border-primary-400 transition-colors">
                                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])}
                                    className="hidden" id="resume-upload" />
                                <label htmlFor="resume-upload" className="cursor-pointer">
                                    <Upload size={24} className="mx-auto text-surface-400 mb-2" />
                                    <p className="text-sm text-surface-500">{resumeFile ? resumeFile.name : 'Click to upload your resume'}</p>
                                    <p className="text-xs text-surface-400 mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1">University</label>
                                <input type="text" value={applyForm.university} onChange={(e) => setApplyForm({ ...applyForm, university: e.target.value })}
                                    className="input-field" placeholder="Your university name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                                <input type="tel" value={applyForm.phone} onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                                    className="input-field" placeholder="+91 98765 43210" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Skills (comma-separated)</label>
                            <input type="text" value={applyForm.skills} onChange={(e) => setApplyForm({ ...applyForm, skills: e.target.value })}
                                className="input-field" placeholder="React, Node.js, Python, etc." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Cover Letter</label>
                            <textarea value={applyForm.coverLetter} onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                                className="input-field" rows={4} placeholder="Why are you a good fit for this internship?" />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowApplyModal(false)} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={applying} className="btn-primary disabled:opacity-50 flex items-center gap-2">
                                {applying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckCircle size={16} />}
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default InternshipDetail;
