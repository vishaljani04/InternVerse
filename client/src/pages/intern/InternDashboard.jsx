import { useState, useEffect } from 'react';
import { ListTodo, Star, Award, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import StatsCard from '../../components/common/StatsCard';
import api from '../../services/api';

const InternDashboard = () => {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchDashboard(); }, []);

    const fetchDashboard = async () => {
        try {
            const { data } = await api.get('/dashboard/intern');
            setDashData(data);
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

    const stats = dashData?.stats;
    const intern = dashData?.intern;
    const latestEval = dashData?.latestEvaluation;
    const recentTasks = dashData?.recentTasks;

    const radarData = latestEval ? [
        { subject: 'Technical', score: latestEval.scores.technical },
        { subject: 'Communication', score: latestEval.scores.communication },
        { subject: 'Problem Solving', score: latestEval.scores.problemSolving },
        { subject: 'Team Work', score: latestEval.scores.teamWork },
        { subject: 'Punctuality', score: latestEval.scores.punctuality },
        { subject: 'Overall', score: latestEval.scores.overall },
    ] : [];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-surface-900">My Dashboard</h1>
                <p className="text-surface-500 mt-1">Welcome back, {intern?.userId?.name}!</p>
            </div>

            {/* Internship Overview */}
            <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-surface-800">{intern?.internshipRole}</h3>
                        <p className="text-sm text-surface-500">{intern?.department} · Mentor: {intern?.mentor || 'N/A'}</p>
                    </div>
                    <span className={`badge ${intern?.status === 'active' ? 'badge-success' : intern?.status === 'completed' ? 'badge-info' : 'badge-warning'}`}>
                        {intern?.status}
                    </span>
                </div>
                <div className="mb-2 flex justify-between text-sm">
                    <span className="text-surface-500">Internship Progress</span>
                    <span className="font-bold text-primary-600">{stats?.progress || 0}%</span>
                </div>
                <div className="w-full h-3 bg-surface-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${stats?.progress || 0}%` }}></div>
                </div>
                <p className="text-xs text-surface-400 mt-2">
                    {new Date(intern?.startDate).toLocaleDateString()} — {new Date(intern?.endDate).toLocaleDateString()}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard icon={ListTodo} label="Total Tasks" value={stats?.totalTasks || 0} color="primary" index={0} />
                <StatsCard icon={CheckCircle} label="Completed" value={stats?.completedTasks || 0} color="emerald" index={1} />
                <StatsCard icon={Clock} label="Pending" value={stats?.pendingTasks || 0} color="amber" index={2} />
                <StatsCard icon={Award} label="Certificates" value={stats?.certificateCount || 0} color="violet" index={3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tasks */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-surface-800 mb-4">Recent Tasks</h3>
                    <div className="space-y-3">
                        {recentTasks?.length > 0 ? recentTasks.map((task, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                                <div>
                                    <p className="text-sm font-medium text-surface-800">{task.title}</p>
                                    <p className="text-xs text-surface-400">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                                </div>
                                <span className={`badge ${task.status === 'approved' ? 'badge-success' :
                                        task.status === 'submitted' ? 'badge-info' :
                                            task.status === 'rejected' ? 'badge-danger' :
                                                task.status === 'in-progress' ? 'badge-purple' : 'badge-warning'
                                    }`}>{task.status}</span>
                            </div>
                        )) : (
                            <p className="text-surface-400 text-center py-4">No tasks assigned yet</p>
                        )}
                    </div>
                </div>

                {/* Performance Radar */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-surface-800 mb-4">Latest Performance</h3>
                    {latestEval ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                                <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-surface-400">
                            <p>No evaluations yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InternDashboard;
