import { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon } from 'lucide-react';


const ManageTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', assignedTo: '', deadline: '', priority: 'medium' });
    const { isHR, isAdmin } = useAuth();

    useEffect(() => { fetchTasks(); fetchInterns(); }, [statusFilter]);

    const fetchTasks = async () => {
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            const { data } = await api.get('/tasks', { params });
            setTasks(data.tasks);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchInterns = async () => {
        try {
            const { data } = await api.get('/interns', { params: { status: 'active' } });
            setInterns(data.interns);
        } catch (err) { console.error(err); }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (form.assignedTo === 'all') {
                const activeInterns = interns.filter(i => i.status === 'active');
                if (activeInterns.length === 0) {
                    alert('No active interns found to assign tasks to.');
                    return;
                }
                const promises = activeInterns.map(i =>
                    api.post('/tasks', { ...form, assignedTo: i._id })
                );
                await Promise.all(promises);
                alert(`Task assigned to all ${activeInterns.length} interns.`);
            } else {
                await api.post('/tasks', form);
            }
            setShowModal(false);
            setForm({ title: '', description: '', assignedTo: '', deadline: '', priority: 'medium' });
            fetchTasks();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating task(s)');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try { await api.delete(`/tasks/${id}`); fetchTasks(); } catch (err) { console.error(err); alert(err.response?.data?.message || 'Failed to delete task.'); }
    };

    const statusIcon = (status) => {
        return <CheckCircle size={16} className="text-emerald-500" />;
    };

    const priorityColor = (p) => {
        switch (p) {
            case 'urgent': return 'badge-danger';
            case 'high': return 'bg-orange-100 text-orange-700';
            case 'medium': return 'badge-warning';
            default: return 'bg-surface-100 text-surface-600';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900">Task Management</h1>
                    <p className="text-surface-500 mt-1">Create, assign, and track intern tasks</p>
                </div>
                {isHR && (
                    <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2" id="create-task-btn">
                        <Plus size={18} /> Create Task
                    </button>
                )}
            </div>

            {/* Filters */}
            {/* Removed status filters as tasks are strictly assignments now */}

            {/* Tasks List */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>
            ) : tasks.length === 0 ? (
                <div className="glass-card p-12 text-center"><p className="text-surface-400 text-lg">No tasks found</p></div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div key={task._id} className="glass-card p-5 hover:shadow-card-hover transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {statusIcon(task.status)}
                                        <h3 className="font-semibold text-surface-900">{task.title}</h3>
                                        <span className={`badge ${priorityColor(task.priority)}`}>{task.priority}</span>
                                    </div>
                                    <p className="text-sm text-surface-500 line-clamp-1">{task.description}</p>
                                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-surface-400">
                                        <span>Assigned to: <strong className="text-surface-600">{task.assignedTo?.userId?.name || 'Unknown'}</strong></span>
                                        <span>Deadline: <strong className="text-surface-600">{new Date(task.deadline).toLocaleDateString()}</strong></span>
                                        <span>By: <strong className="text-surface-600">{task.assignedBy?.name || 'Unknown'}</strong></span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {(isAdmin || isHR) && (
                                        <button onClick={() => handleDelete(task._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                            <XCircle size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Task Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Task" size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Task Title *</label>
                        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required placeholder="e.g., Build Login Page" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Description *</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={4} required placeholder="Task details..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-surface-700">Assign To *</label>
                                <button type="button" onClick={() => window.open('/hr/interns', '_blank')} className="text-xs text-primary-600 hover:underline">View All Interns</button>
                            </div>
                            <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="input-field" required>
                                <option value="">Select Intern</option>
                                <option value="all" className="font-bold text-primary-600">✨ All Interns</option>
                                {interns.map((i) => (
                                    <option key={i._id} value={i._id}>
                                        {i.userId?.name || 'Unknown'} - {i.internshipRole} ({i.department})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Deadline *</label>
                            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Priority</label>
                            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary disabled:opacity-50" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageTasks;
