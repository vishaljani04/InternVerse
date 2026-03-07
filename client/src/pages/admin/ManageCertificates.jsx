import { useState, useEffect } from 'react';
import { Award, Download, Plus, Trash2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedIntern, setSelectedIntern] = useState('');
    const [generating, setGenerating] = useState(false);
    const { isHR, isAdmin } = useAuth();

    useEffect(() => { fetchCertificates(); fetchInterns(); }, []);

    const fetchCertificates = async () => {
        try {
            const { data } = await api.get('/certificates');
            setCertificates(data.certificates);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchInterns = async () => {
        try {
            const { data } = await api.get('/interns');
            setInterns(data.interns);
        } catch (err) { console.error(err); }
    };

    const handleGenerate = async () => {
        if (!selectedIntern) return;
        setGenerating(true);
        try {
            if (selectedIntern === 'all') {
                const eligibleInterns = interns.filter(i => i.status === 'active' || i.status === 'completed');
                if (eligibleInterns.length === 0) {
                    alert('No eligible interns found for certificate generation.');
                    return;
                }
                const promises = eligibleInterns.map(i =>
                    api.post('/certificates/generate', { internId: i._id })
                );
                await Promise.all(promises);
                alert(`Certificates generated for all ${eligibleInterns.length} interns.`);
            } else {
                await api.post('/certificates/generate', { internId: selectedIntern });
            }
            setShowModal(false);
            setSelectedIntern('');
            fetchCertificates();
            fetchInterns();
        } catch (err) {
            alert(err.response?.data?.message || 'Error generating certificate(s)');
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this certificate?')) return;
        try {
            await api.delete(`/certificates/${id}`);
            fetchCertificates();
            fetchInterns(); // Refresh interns to allow re-generation
        } catch (err) { alert(err.response?.data?.message || 'Error deleting certificate'); }
    };

    const handleDownload = async (id) => {
        try {
            const response = await api.get(`/certificates/${id}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificate_${id}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900">Certificates</h1>
                    <p className="text-surface-500 mt-1">Generate and manage internship certificates</p>
                </div>
                {isHR && (
                    <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2" id="gen-cert-btn">
                        <Plus size={18} /> Generate Certificate
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>
            ) : certificates.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <Award size={48} className="mx-auto text-surface-300 mb-4" />
                    <p className="text-surface-400 text-lg">No certificates generated yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {certificates.map((cert) => (
                        <div key={cert._id} className="glass-card p-6 hover:shadow-card-hover transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center">
                                    <Award size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-surface-900">{cert.internName}</h3>
                                    <p className="text-xs text-surface-400">{cert.certificateId}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between"><span className="text-surface-500">Role:</span><span className="font-medium text-surface-700">{cert.internshipRole}</span></div>
                                <div className="flex justify-between"><span className="text-surface-500">Department:</span><span className="font-medium text-surface-700">{cert.department}</span></div>
                                <div className="flex justify-between"><span className="text-surface-500">Duration:</span><span className="font-medium text-surface-700">
                                    {new Date(cert.startDate).toLocaleDateString()} - {new Date(cert.endDate).toLocaleDateString()}
                                </span></div>
                                <div className="flex justify-between"><span className="text-surface-500">Rating:</span>
                                    <span className="font-bold text-amber-600">{cert.performanceRating}/10 ★</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => handleDownload(cert._id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition-colors">
                                    <Download size={16} /> Download
                                </button>
                                {(isAdmin || isHR) && (
                                    <button onClick={() => handleDelete(cert._id)}
                                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                        title="Delete Certificate">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Generate Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Generate Certificate">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-surface-700">Select Intern *</label>
                            <button type="button" onClick={() => window.open('/hr/interns', '_blank')} className="text-xs text-primary-600 hover:underline">View All Interns</button>
                        </div>
                        <select value={selectedIntern} onChange={(e) => setSelectedIntern(e.target.value)} className="input-field">
                            <option value="">Choose an intern</option>
                            <option value="all" className="font-bold text-primary-600">✨ All Eligible Interns</option>
                            {interns.filter(i => i.status === 'active' || i.status === 'completed').map((i) => (
                                <option key={i._id} value={i._id}>{i.userId?.name || 'Unknown'} - {i.internshipRole}</option>
                            ))}
                        </select>
                    </div>
                    <p className="text-sm text-surface-500">
                        This will generate a PDF certificate, mark the internship as completed, and send email notifications.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                        <button onClick={handleGenerate} disabled={generating || !selectedIntern} className="btn-primary disabled:opacity-50 flex items-center gap-2">
                            {generating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Award size={16} />}
                            {generating ? 'Generating...' : 'Generate Certificate'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageCertificates;
