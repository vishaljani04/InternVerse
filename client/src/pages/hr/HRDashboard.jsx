import { useState, useEffect } from 'react';
import { Users, ListTodo, Star, Clock } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import api from '../../services/api';

const HRDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentEvals, setRecentEvals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchDashboard(); }, []);

    const fetchDashboard = async () => {
        try {
            const { data } = await api.get('/dashboard/hr');
            setStats(data.stats);
            setRecentEvals(data.recentEvaluations || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-surface-900">HR Dashboard</h1>
                <p className="text-surface-500 mt-1">Manage interns and track performance</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard icon={Users} label="Total Interns" value={stats?.totalInterns || 0} color="primary" index={0} />
                <StatsCard icon={Users} label="Active Interns" value={stats?.activeInterns || 0} color="emerald" index={1} />
                <StatsCard icon={ListTodo} label="Pending Tasks" value={stats?.pendingTasks || 0} color="amber" index={2} />
                <StatsCard icon={Clock} label="Submitted Tasks" value={stats?.submittedTasks || 0} color="blue" index={3} />
            </div>

            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-surface-800 mb-4">Recent Evaluations</h3>
                <div className="space-y-3">
                    {recentEvals.length > 0 ? recentEvals.map((ev, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-primary-400 rounded-full flex items-center justify-center">
                                    <Star size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-surface-800">{ev.internId?.userId?.name || 'Unknown'}</p>
                                    <p className="text-xs text-surface-400">{ev.period} review</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-primary-600">{ev.scores?.overall}/10</span>
                        </div>
                    )) : (
                        <p className="text-surface-400 text-center py-4">No recent evaluations</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;
