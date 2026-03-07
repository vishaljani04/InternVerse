import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Trash2, ToggleLeft, ToggleRight, Briefcase, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../services/api';

const ManageListings = () => {
    const [listings, setListings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showAppsModal, setShowAppsModal] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [form, setForm] = useState({
        title: '', company: 'InternVerse Technologies', description: '', department: '',
        location: 'Remote', type: 'remote', duration: '', stipend: 'Unpaid',
        skills: '', requirements: '', responsibilities: '', openings: 1, deadline: ''
    });

    useEffect(() => { fetchListings(); }, []);

    const fetchListings = async () => {
        try {
            const { data } = await api.get('/listings/admin');
            setListings(data.listings);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
            await api.post('/listings', payload);
            setShowModal(false);
            setForm({ title: '', company: 'InternVerse Technologies', description: '', department: '', location: 'Remote', type: 'remote', duration: '', stipend: 'Unpaid', skills: '', requirements: '', responsibilities: '', openings: 1, deadline: '' });
            fetchListings();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleToggle = async (id) => {
        try { await api.patch(`/listings/${id}/toggle`); fetchListings(); }
        catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this listing?')) return;
        try { await api.delete(`/listings/${id}`); fetchListings(); }
        catch (err) { console.error(err); }
    };

    const viewApplications = async (listing) => {
        setSelectedListing(listing);
        try {
            const { data } = await api.get('/applications', { params: { listingId: listing._id } });
            setApplications(data.applications);
            setShowAppsModal(true);
        } catch (err) { console.error(err); }
    };

    const updateAppStatus = async (appId, status) => {
        try {
            await api.patch(`/applications/${appId}/status`, { status });
            // Refresh applications
            const { data } = await api.get('/applications', { params: { listingId: selectedListing._id } });
            setApplications(data.applications);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900">Internship Listings</h1>
                    <p className="text-surface-500 mt-1">Create and manage internship opportunities</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2" id="create-listing-btn">
                    <Plus size={18} /> Create Listing
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>
            ) : listings.length === 0 ? (
                <div className="glass-card p-12 text-center"><p className="text-surface-400 text-lg">No listings yet</p></div>
            ) : (
                <div className="space-y-3">
                    {listings.map((l) => (
                        <div key={l._id} className="glass-card p-5 hover:shadow-card-hover transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-surface-900">{l.title}</h3>
                                        <span className={`badge ${l.isActive ? 'badge-success' : 'badge-danger'}`}>{l.isActive ? 'Active' : 'Inactive'}</span>
                                        <span className="badge badge-info capitalize">{l.type}</span>
                                    </div>
                                    <p className="text-sm text-surface-500">{l.company} · {l.department} · {l.location}</p>
                                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-surface-400">
                                        <span>Duration: {l.duration}</span>
                                        <span>Stipend: {l.stipend}</span>
                                        <span>Openings: {l.openings}</span>
                                        <span>Deadline: {new Date(l.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => viewApplications(l)}
                                        className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors flex items-center gap-1">
                                        <Users size={14} /> Applications
                                    </button>
                                    <button onClick={() => handleToggle(l._id)} className="p-2 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors">
                                        {l.isActive ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} />}
                                    </button>
                                    <button onClick={() => handleDelete(l._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Listing Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Internship Listing" size="xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Title *</label>
                            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required placeholder="e.g., Frontend Developer Intern" /></div>
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Company *</label>
                            <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" required /></div>
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Department *</label>
                            <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field" required placeholder="e.g., Engineering" /></div>
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Location</label>
                            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="e.g., Mumbai, India" /></div>
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Type</label>
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                                <option value="remote">Remote</option><option value="onsite">On-site</option><option value="hybrid">Hybrid</option>
                            </select></div>
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Duration *</label>
                            <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field" required placeholder="e.g., 3 months" /></div>
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Stipend</label>
                            <input type="text" value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} className="input-field" placeholder="e.g., ₹10,000/month" /></div>
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Openings</label>
                            <input type="number" value={form.openings} onChange={(e) => setForm({ ...form, openings: parseInt(e.target.value) })} className="input-field" min="1" /></div>
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Application Deadline *</label>
                            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="input-field" required /></div>
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Skills (comma-separated)</label>
                            <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="input-field" placeholder="React, Node.js, Python" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Description *</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} required placeholder="Describe the internship..." /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Responsibilities</label>
                        <textarea value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} className="input-field" rows={3} placeholder="Key responsibilities..." /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Requirements</label>
                        <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className="input-field" rows={3} placeholder="Required qualifications..." /></div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Publish Listing</button>
                    </div>
                </form>
            </Modal>

            {/* Applications Modal */}
            <Modal isOpen={showAppsModal} onClose={() => setShowAppsModal(false)} title={`Applications — ${selectedListing?.title || ''}`} size="xl">
                {applications.length === 0 ? (
                    <p className="text-surface-400 text-center py-8">No applications yet</p>
                ) : (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                        {applications.map((app) => (
                            <div key={app._id} className="p-4 bg-surface-50 rounded-xl">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-surface-900">{app.name}</p>
                                        <p className="text-sm text-surface-500">{app.email} {app.phone ? `· ${app.phone}` : ''}</p>
                                        {app.university && <p className="text-xs text-surface-400">{app.university}</p>}
                                    </div>
                                    <span className={`badge ${app.status === 'accepted' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : app.status === 'shortlisted' ? 'badge-purple' : 'badge-warning'}`}>{app.status}</span>
                                </div>
                                {app.skills?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {app.skills.map((s, i) => <span key={i} className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded font-medium">{s}</span>)}
                                    </div>
                                )}
                                {app.coverLetter && <p className="text-sm text-surface-600 mb-2">{app.coverLetter}</p>}
                                {app.resumePath && (
                                    <a href={`http://localhost:5000${app.resumePath}`} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:underline">📄 View Resume</a>
                                )}
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => updateAppStatus(app._id, 'shortlisted')} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-100">Shortlist</button>
                                    <button onClick={() => updateAppStatus(app._id, 'accepted')} className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-100">Accept</button>
                                    <button onClick={() => updateAppStatus(app._id, 'rejected')} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageListings;
