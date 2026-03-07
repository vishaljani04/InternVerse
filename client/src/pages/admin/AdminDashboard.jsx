import { useState, useEffect } from 'react';
import { Users, ListTodo, Star, Award, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import StatsCard from '../../components/common/StatsCard';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [recent, setRecent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const { data } = await api.get('/dashboard/admin');
            setStats(data.stats);
            setCharts(data.charts);
            setRecent(data.recent);
        } catch (err) {
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    const taskStatusData = charts?.taskStats?.map(t => ({
        name: t._id?.charAt(0).toUpperCase() + t._id?.slice(1),
        value: t.count
    })) || [];

    const monthlyData = charts?.monthlyInterns?.map(m => ({
        month: m._id,
        interns: m.count
    })) || [];

    const deptData = charts?.departmentStats?.map(d => ({
        name: d._id,
        count: d.count
    })) || [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                    <p className="text-surface-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-surface-900">Admin Dashboard</h1>
                <p className="text-surface-500 mt-1">Welcome back! Here's your organization overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard icon={Users} label="Total Interns" value={stats?.totalInterns || 0} color="primary" index={0} />
                <StatsCard icon={UserCheck} label="Active Interns" value={stats?.activeInterns || 0} color="emerald" index={1} />
                <StatsCard icon={ListTodo} label="Total Tasks" value={stats?.totalTasks || 0} color="blue" index={2} />
                <StatsCard icon={Award} label="Certificates" value={stats?.certificatesGenerated || 0} color="violet" index={3} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard icon={Clock} label="Pending Tasks" value={stats?.pendingTasks || 0} color="amber" index={4} />
                <StatsCard icon={TrendingUp} label="Submitted Tasks" value={stats?.submittedTasks || 0} color="cyan" index={5} />
                <StatsCard icon={Star} label="Evaluations" value={stats?.pendingEvaluations || 0} color="accent" index={6} />
                <StatsCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="rose" index={7} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Interns Trend */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-surface-800 mb-4">Intern Onboarding Trend</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="colorInterns" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                            <Tooltip
                                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="interns" stroke="#6366f1" fillOpacity={1} fill="url(#colorInterns)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Task Status Distribution */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-surface-800 mb-4">Task Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={taskStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {taskStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-4 justify-center mt-2">
                        {taskStatusData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[index % COLORS.length] }}></div>
                                <span className="text-surface-600">{entry.name}: {entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Department Stats */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-surface-800 mb-4">Interns by Department</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={deptData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                        <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-surface-800 mb-4">Recent Interns</h3>
                    <div className="space-y-3">
                        {recent?.interns?.length > 0 ? recent.interns.map((intern, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            {intern.userId?.name?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-surface-800">{intern.userId?.name || 'Unknown'}</p>
                                        <p className="text-xs text-surface-400">{intern.internshipRole}</p>
                                    </div>
                                </div>
                                <span className={`badge ${intern.status === 'active' ? 'badge-success' : intern.status === 'completed' ? 'badge-info' : 'badge-warning'}`}>
                                    {intern.status}
                                </span>
                            </div>
                        )) : (
                            <p className="text-surface-400 text-sm text-center py-4">No recent interns</p>
                        )}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-surface-800 mb-4">Recent Tasks</h3>
                    <div className="space-y-3">
                        {recent?.tasks?.length > 0 ? recent.tasks.map((task, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                                <div>
                                    <p className="text-sm font-medium text-surface-800">{task.title}</p>
                                    <p className="text-xs text-surface-400">by {task.assignedBy?.name || 'Unknown'}</p>
                                </div>
                                <span className={`badge ${task.status === 'approved' ? 'badge-success' :
                                        task.status === 'submitted' ? 'badge-info' :
                                            task.status === 'rejected' ? 'badge-danger' :
                                                task.status === 'in-progress' ? 'badge-purple' : 'badge-warning'
                                    }`}>
                                    {task.status}
                                </span>
                            </div>
                        )) : (
                            <p className="text-surface-400 text-sm text-center py-4">No recent tasks</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
