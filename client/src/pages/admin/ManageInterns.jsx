import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../services/api';

const ManageInterns = () => {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingIntern, setEditingIntern] = useState(null);
    const [form, setForm] = useState({
        name: '', email: '', password: 'intern@123', department: '', internshipRole: '',
        startDate: '', endDate: '', mentor: '', university: '', bio: ''
    });

    useEffect(() => { fetchInterns(); }, [search, statusFilter]);

    const fetchInterns = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            const { data } = await api.get('/interns', { params });
            setInterns(data.interns);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingIntern) {
                await api.put(`/interns/${editingIntern._id}`, form);
            } else {
                await api.post('/interns', form);
            }
            setShowModal(false);
            setEditingIntern(null);
            setForm({ name: '', email: '', password: 'intern@123', department: '', internshipRole: '', startDate: '', endDate: '', mentor: '', university: '', bio: '' });
            fetchInterns();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleEdit = (intern) => {
        setEditingIntern(intern);
        setForm({
            name: intern.userId?.name || '', email: intern.userId?.email || '', password: '',
            department: intern.department, internshipRole: intern.internshipRole,
            startDate: intern.startDate?.split('T')[0] || '', endDate: intern.endDate?.split('T')[0] || '',
            mentor: intern.mentor, university: intern.university || '', bio: intern.bio || ''
        });
        setShowModal(true);
    };

    const handleToggle = async (id) => {
        try {
            await api.patch(`/interns/${id}/toggle`);
            fetchInterns();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/interns/${id}`);
            fetchInterns();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900">Manage Interns</h1>
                    <p className="text-surface-500 mt-1">Add, edit, and manage intern profiles</p>
                </div>
                <button onClick={() => { setEditingIntern(null); setForm({ name: '', email: '', password: 'intern@123', department: '', internshipRole: '', startDate: '', endDate: '', mentor: '', university: '', bio: '' }); setShowModal(true); }} className="btn-primary flex items-center gap-2" id="add-intern-btn">
                    <Plus size={18} /> Add Intern
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input type="text" placeholder="Search interns..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11" id="search-interns" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto min-w-[150px]">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="terminated">Terminated</option>
                    <option value="on-hold">On Hold</option>
                </select>
            </div>

            {/* Interns Grid */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>
            ) : interns.length === 0 ? (
                <div className="glass-card p-12 text-center"><p className="text-surface-400 text-lg">No interns found</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {interns.map((intern) => (
                        <div key={intern._id} className="glass-card p-6 hover:shadow-card-hover transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">{intern.userId?.name?.charAt(0) || '?'}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-surface-900">{intern.userId?.name || 'Unknown'}</h3>
                                        <p className="text-xs text-surface-400">{intern.userId?.email}</p>
                                    </div>
                                </div>
                                <span className={`badge ${intern.status === 'active' ? 'badge-success' : intern.status === 'completed' ? 'badge-info' : 'badge-warning'}`}>
                                    {intern.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm"><span className="text-surface-500">Role:</span><span className="font-medium text-surface-700">{intern.internshipRole}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-surface-500">Department:</span><span className="font-medium text-surface-700">{intern.department}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-surface-500">Mentor:</span><span className="font-medium text-surface-700">{intern.mentor || 'N/A'}</span></div>
                            </div>

                            {/* Progress bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1"><span className="text-surface-500">Progress</span><span className="font-semibold text-primary-600">{intern.progress}%</span></div>
                                <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500" style={{ width: `${intern.progress}%` }}></div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-surface-100">
                                <button onClick={() => handleEdit(intern)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors">
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleToggle(intern._id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors">
                                    {intern.status === 'active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                    {intern.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button onClick={() => handleDelete(intern._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingIntern ? 'Edit Intern' : 'Add New Intern'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Full Name *</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required disabled={!!editingIntern} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Email *</label>
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" required disabled={!!editingIntern} />
                        </div>
                        {!editingIntern && (
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1">Password</label>
                                <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Department *</label>
                            <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field" required placeholder="e.g., Engineering" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Internship Role *</label>
                            <input type="text" value={form.internshipRole} onChange={(e) => setForm({ ...form, internshipRole: e.target.value })} className="input-field" required placeholder="e.g., Frontend Developer" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Start Date *</label>
                            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">End Date *</label>
                            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Mentor</label>
                            <input type="text" value={form.mentor} onChange={(e) => setForm({ ...form, mentor: e.target.value })} className="input-field" placeholder="Mentor name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">University</label>
                            <input type="text" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className="input-field" placeholder="University name" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Bio</label>
                        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field" rows={3} placeholder="Brief description..." />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">{editingIntern ? 'Update' : 'Add Intern'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageInterns;
