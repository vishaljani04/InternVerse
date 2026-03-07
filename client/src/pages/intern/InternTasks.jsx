import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, Send, Paperclip } from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../services/api';

const InternTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks/my');
            setTasks(data.tasks);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };
    const getStatusIcon = (status) => {
        return <CheckCircle size={20} className="text-emerald-500" />;
    };

    const getPriorityBadge = (p) => {
        switch (p) {
            case 'urgent': return 'badge-danger';
            case 'high': return 'bg-orange-100 text-orange-700';
            case 'medium': return 'badge-warning';
            default: return 'bg-surface-100 text-surface-600';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-surface-900">My Tasks</h1>
                <p className="text-surface-500 mt-1">View and submit your assigned internship tasks</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>
            ) : tasks.length === 0 ? (
                <div className="glass-card p-12 text-center text-surface-400">No tasks assigned yet</div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {tasks.map((task) => (
                        <div key={task._id} className="glass-card p-6 flex flex-col h-full hover:shadow-card-hover transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(task.status)}
                                    <h3 className="font-semibold text-surface-900">{task.title}</h3>
                                </div>
                                <span className={`badge ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
                            </div>

                            <p className="text-sm text-surface-600 mb-4 flex-1 line-clamp-3">{task.description}</p>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-xs border-b border-surface-100 pb-2">
                                    <span className="text-surface-400">Assigned By:</span>
                                    <span className="font-medium text-surface-700">{task.assignedBy?.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs border-b border-surface-100 pb-2">
                                    <span className="text-surface-400">Deadline:</span>
                                    <span className={`font-semibold ${new Date(task.deadline) < new Date() ? 'text-red-500' : 'text-surface-700'}`}>
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs border-b border-surface-100 pb-2">
                                    <span className="text-surface-400">Status:</span>
                                    <span className="badge badge-info whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                                        Assigned
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InternTasks;
