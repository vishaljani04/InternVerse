import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const MyEvaluations = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => { fetchEvaluations(); }, []);

    const fetchEvaluations = async () => {
        try {
            const { data } = await api.get('/evaluations/my');
            setEvaluations(data.evaluations);
            if (data.evaluations.length > 0) setSelected(data.evaluations[0]);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const avgScore = (scores) => {
        const vals = Object.values(scores);
        return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
    };

    const radarData = selected ? [
        { subject: 'Technical', score: selected.scores.technical },
        { subject: 'Communication', score: selected.scores.communication },
        { subject: 'Problem Solving', score: selected.scores.problemSolving },
        { subject: 'Team Work', score: selected.scores.teamWork },
        { subject: 'Punctuality', score: selected.scores.punctuality },
        { subject: 'Overall', score: selected.scores.overall },
    ] : [];

    if (loading) {
        return <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-surface-900">My Evaluations</h1>
                <p className="text-surface-500 mt-1">View your performance evaluations</p>
            </div>

            {evaluations.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <Star size={48} className="mx-auto text-surface-300 mb-4" />
                    <p className="text-surface-400 text-lg">No evaluations yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Evaluation List */}
                    <div className="space-y-3">
                        {evaluations.map((ev) => (
                            <button key={ev._id} onClick={() => setSelected(ev)}
                                className={`w-full text-left p-4 rounded-xl transition-all ${selected?._id === ev._id ? 'bg-primary-50 border-2 border-primary-500' : 'glass-card hover:shadow-card-hover'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-surface-800 capitalize">{ev.period} Review</p>
                                        <p className="text-xs text-surface-400">{new Date(ev.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                                        <Star size={12} className="text-amber-500 fill-amber-500" />
                                        <span className="text-sm font-bold text-amber-700">{avgScore(ev.scores)}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Selected Evaluation Detail */}
                    {selected && (
                        <div className="lg:col-span-2 space-y-4">
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-semibold text-surface-800 mb-1 capitalize">{selected.period} Evaluation</h3>
                                <p className="text-sm text-surface-400 mb-4">By {selected.evaluatorId?.name} · {new Date(selected.createdAt).toLocaleDateString()}</p>

                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                                        <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="glass-card p-6">
                                <h4 className="font-semibold text-surface-800 mb-3">Score Breakdown</h4>
                                <div className="space-y-3">
                                    {Object.entries(selected.scores).map(([key, val]) => (
                                        <div key={key}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-surface-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                <span className="font-bold text-primary-600">{val}/10</span>
                                            </div>
                                            <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all" style={{ width: `${val * 10}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {(selected.comments || selected.recommendations) && (
                                <div className="glass-card p-6 space-y-4">
                                    {selected.comments && (
                                        <div>
                                            <h4 className="font-semibold text-surface-800 mb-2">Comments</h4>
                                            <p className="text-sm text-surface-600 bg-surface-50 rounded-lg p-3">{selected.comments}</p>
                                        </div>
                                    )}
                                    {selected.recommendations && (
                                        <div>
                                            <h4 className="font-semibold text-surface-800 mb-2">Recommendations</h4>
                                            <p className="text-sm text-surface-600 bg-surface-50 rounded-lg p-3">{selected.recommendations}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyEvaluations;
