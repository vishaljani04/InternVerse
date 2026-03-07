import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../services/api';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [submitContent, setSubmitContent] = useState('');

    useEffect(() => { fetchTasks(); }, [statusFilter]);

    const fetchTasks = async () => {
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            const { data } = await api.get('/tasks/my', { params });
            setTasks(data.tasks);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async () => {
        try {
            await api.post(`/tasks/${selectedTask._id}/submit`, { content: submitContent });
            setShowSubmitModal(false);
            setSelectedTask(null);
            setSubmitContent('');
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const priorityColor = (p) => {
        switch (p) {
            case 'urgent': return 'border-l-red-500';
            case 'high': return 'border-l-orange-500';
            case 'medium': return 'border-l-amber-500';
            default: return 'border-l-surface-300';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-surface-900">My Tasks</h1>
                <p className="text-surface-500 mt-1">View and manage your assigned tasks</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {['', 'pending', 'in-progress', 'submitted', 'approved', 'rejected'].map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === s ? 'bg-primary-500 text-white shadow-glow' : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'}`}>
                        {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>
            ) : tasks.length === 0 ? (
                <div className="glass-card p-12 text-center"><p className="text-surface-400 text-lg">No tasks found</p></div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div key={task._id} className={`glass-card p-5 border-l-4 ${priorityColor(task.priority)} hover:shadow-card-hover transition-all`}>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-surface-900">{task.title}</h3>
                                        <span className={`badge ${task.status === 'approved' ? 'badge-success' :
                                                task.status === 'submitted' ? 'badge-info' :
                                                    task.status === 'rejected' ? 'badge-danger' :
                                                        task.status === 'in-progress' ? 'badge-purple' : 'badge-warning'
                                            }`}>{task.status}</span>
                                    </div>
                                    <p className="text-sm text-surface-500 mb-2">{task.description}</p>
                                    <div className="flex flex-wrap gap-3 text-xs text-surface-400">
                                        <span className="flex items-center gap-1"><Clock size={12} /> Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                        <span className="capitalize">Priority: <strong className="text-surface-600">{task.priority}</strong></span>
                                    </div>

                                    {task.feedback && task.status === 'rejected' && (
                                        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                            <p className="text-xs font-medium text-red-700">Feedback: {task.feedback}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {task.status === 'pending' && (
                                        <button onClick={() => handleStatusChange(task._id, 'in-progress')}
                                            className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-1">
                                            <AlertCircle size={14} /> Start Work
                                        </button>
                                    )}
                                    {(task.status === 'in-progress' || task.status === 'rejected') && (
                                        <button onClick={() => { setSelectedTask(task); setShowSubmitModal(true); }}
                                            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors flex items-center gap-1">
                                            <Upload size={14} /> Submit
                                        </button>
                                    )}
                                    {task.status === 'approved' && (
                                        <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                            <CheckCircle size={16} /> Completed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Submit Modal */}
            <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Task">
                <div className="space-y-4">
                    <div className="bg-surface-50 rounded-xl p-4">
                        <h4 className="font-semibold text-surface-800">{selectedTask?.title}</h4>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Submission Details *</label>
                        <textarea value={submitContent} onChange={(e) => setSubmitContent(e.target.value)}
                            className="input-field" rows={5} placeholder="Describe your completed work, include links, notes, etc." required />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowSubmitModal(false)} className="btn-secondary">Cancel</button>
                        <button onClick={handleSubmit} disabled={!submitContent.trim()} className="btn-primary disabled:opacity-50">Submit Task</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MyTasks;
