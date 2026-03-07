import { useState, useEffect } from 'react';
import { Star, TrendingUp, Award, Clock } from 'lucide-react';
import api from '../../services/api';

const InternEvaluations = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchEvaluations(); }, []);

    const fetchEvaluations = async () => {
        try {
            const { data } = await api.get('/evaluations/my');
            setEvaluations(data.evaluations);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const avgScore = (scores) => {
        const vals = Object.values(scores);
        return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
    };

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-emerald-600';
        if (score >= 5) return 'text-amber-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-surface-900">Performance Evolution</h1>
                <p className="text-surface-500 mt-1">Track your growth and performance reviews</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>
            ) : evaluations.length === 0 ? (
                <div className="glass-card p-12 text-center text-surface-400">
                    <TrendingUp size={48} className="mx-auto text-surface-200 mb-4" />
                    <p className="text-lg">No performance reviews yet. Keep working hard!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Performance Summary Chart/Card would go here */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {evaluations.map((ev) => (
                            <div key={ev._id} className="glass-card overflow-hidden hover:shadow-card-hover transition-all">
                                <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-4 text-white">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lg capitalize">{ev.period} Review</h3>
                                            <p className="text-white/80 text-xs">{new Date(ev.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
                                            <Star size={18} className="fill-white text-white" />
                                            <span className="text-xl font-black">{avgScore(ev.scores)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-4 mb-6">
                                        {Object.entries(ev.scores).map(([key, val]) => (
                                            <div key={key}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-surface-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                    <span className={`font-bold ${getScoreColor(val)}`}>{val}/10</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full transition-all duration-500" style={{ width: `${val * 10}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {ev.comments && (
                                        <div className="bg-surface-50 rounded-xl p-4 border border-surface-200 mb-4">
                                            <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">Supervisor Comments</h4>
                                            <p className="text-surface-700 text-sm italic">"{ev.comments}"</p>
                                        </div>
                                    )}

                                    {ev.recommendations && (
                                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Recommendations</h4>
                                            <p className="text-emerald-800 text-sm font-medium">{ev.recommendations}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternEvaluations;
