import { useState, useEffect } from 'react';
import { Plus, Star } from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';

const ManageEvaluations = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        internId: '', period: 'monthly', comments: '', recommendations: '',
        scores: { technical: 5, communication: 5, problemSolving: 5, teamWork: 5, punctuality: 5, overall: 5 }
    });
    const { isHR, isAdmin } = useAuth();

    useEffect(() => { fetchEvaluations(); fetchInterns(); }, []);

    const fetchEvaluations = async () => {
        try {
            const { data } = await api.get('/evaluations');
            setEvaluations(data.evaluations);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchInterns = async () => {
        try {
            const { data } = await api.get('/interns');
            setInterns(data.interns);
        } catch (err) { console.error(err); }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (form.internId === 'all') {
                if (interns.length === 0) {
                    alert('No interns found to evaluate.');
                    return;
                }
                const promises = interns.map(i =>
                    api.post('/evaluations', { ...form, internId: i._id })
                );
                await Promise.all(promises);
                alert(`Evaluation submitted for all ${interns.length} interns.`);
            } else {
                await api.post('/evaluations', form);
            }
            setShowModal(false);
            setForm({
                internId: '', period: 'monthly', comments: '', recommendations: '',
                scores: { technical: 5, communication: 5, problemSolving: 5, teamWork: 5, punctuality: 5, overall: 5 }
            });
            fetchEvaluations();
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting evaluation(s)');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateScore = (key, value) => {
        setForm({ ...form, scores: { ...form.scores, [key]: parseInt(value) } });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this evaluation?')) return;
        try {
            await api.delete(`/evaluations/${id}`);
            fetchEvaluations();
        } catch (err) { alert(err.response?.data?.message || 'Error deleting evaluation'); }
    };

    const ScoreSlider = ({ label, scoreKey }) => (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-surface-600">{label}</span>
                <span className="font-bold text-primary-600">{form.scores[scoreKey]}/10</span>
            </div>
            <input type="range" min="0" max="10" value={form.scores[scoreKey]} onChange={(e) => updateScore(scoreKey, e.target.value)}
                className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-500" />
        </div>
    );

    const avgScore = (scores) => {
        const vals = Object.values(scores);
        return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900">Evaluations</h1>
                    <p className="text-surface-500 mt-1">Performance evaluations for interns</p>
                </div>
                {isHR && (
                    <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2" id="create-eval-btn">
                        <Plus size={18} /> New Evaluation
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>
            ) : evaluations.length === 0 ? (
                <div className="glass-card p-12 text-center"><p className="text-surface-400 text-lg">No evaluations yet</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evaluations.map((ev) => (
                        <div key={ev._id} className="glass-card p-6 hover:shadow-card-hover transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-surface-900">{ev.internId?.userId?.name || 'Unknown'}</h3>
                                    <p className="text-xs text-surface-400">{ev.internId?.internshipRole} | {ev.period} review</p>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                                    <Star size={14} className="text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-bold text-amber-700">{avgScore(ev.scores)}</span>
                                </div>
                                {(isAdmin || isHR) && (
                                    <button onClick={() => handleDelete(ev._id)} className="ml-2 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete Evaluation">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {Object.entries(ev.scores).map(([key, val]) => (
                                    <div key={key} className="flex justify-between text-xs">
                                        <span className="text-surface-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-16 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" style={{ width: `${val * 10}%` }}></div>
                                            </div>
                                            <span className="font-semibold text-surface-700">{val}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {ev.comments && <p className="text-sm text-surface-600 bg-surface-50 rounded-lg p-3">{ev.comments}</p>}
                            <p className="text-xs text-surface-400 mt-3">By {ev.evaluatorId?.name} · {new Date(ev.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Evaluation Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Evaluation" size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-surface-700">Intern *</label>
                                <button type="button" onClick={() => window.open('/hr/interns', '_blank')} className="text-xs text-primary-600 hover:underline">View All Interns</button>
                            </div>
                            <select value={form.internId} onChange={(e) => setForm({ ...form, internId: e.target.value })} className="input-field" required>
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
                            <label className="block text-sm font-medium text-surface-700 mb-1">Period</label>
                            <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="input-field">
                                <option value="monthly">Monthly</option>
                                <option value="mid-term">Mid-Term</option>
                                <option value="final">Final</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-surface-50 rounded-xl p-4 space-y-4">
                        <h4 className="font-semibold text-surface-800">Performance Scores</h4>
                        <ScoreSlider label="Technical Skills" scoreKey="technical" />
                        <ScoreSlider label="Communication" scoreKey="communication" />
                        <ScoreSlider label="Problem Solving" scoreKey="problemSolving" />
                        <ScoreSlider label="Team Work" scoreKey="teamWork" />
                        <ScoreSlider label="Punctuality" scoreKey="punctuality" />
                        <ScoreSlider label="Overall Performance" scoreKey="overall" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Comments</label>
                        <textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} className="input-field" rows={3} placeholder="Performance comments..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Recommendations</label>
                        <textarea value={form.recommendations} onChange={(e) => setForm({ ...form, recommendations: e.target.value })} className="input-field" rows={2} placeholder="Recommendations for improvement..." />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary disabled:opacity-50" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageEvaluations;
