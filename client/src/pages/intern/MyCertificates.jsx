import { useState, useEffect } from 'react';
import { Award, Download } from 'lucide-react';
import api from '../../services/api';

const MyCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchCertificates(); }, []);

    const fetchCertificates = async () => {
        try {
            const { data } = await api.get('/certificates/my');
            setCertificates(data.certificates);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDownload = async (id) => {
        try {
            const response = await api.get(`/certificates/${id}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificate.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) { console.error(err); }
    };

    if (loading) {
        return <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-surface-900">My Certificates</h1>
                <p className="text-surface-500 mt-1">Download your internship certificates</p>
            </div>

            {certificates.length === 0 ? (
                <div className="glass-card p-16 text-center">
                    <div className="w-20 h-20 bg-surface-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Award size={40} className="text-surface-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-surface-700 mb-2">No Certificates Yet</h3>
                    <p className="text-surface-400 max-w-md mx-auto">Your certificate will appear here once your internship is completed and your performance has been evaluated.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert) => (
                        <div key={cert._id} className="glass-card p-8 text-center hover:shadow-card-hover transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <Award size={32} className="text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-surface-900 mb-1">Certificate of Completion</h3>
                            <p className="text-sm text-surface-400 mb-4">{cert.certificateId}</p>

                            <div className="space-y-2 text-sm text-left mb-6">
                                <div className="flex justify-between py-2 border-b border-surface-100">
                                    <span className="text-surface-500">Name</span>
                                    <span className="font-medium text-surface-800">{cert.internName}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-surface-100">
                                    <span className="text-surface-500">Role</span>
                                    <span className="font-medium text-surface-800">{cert.internshipRole}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-surface-100">
                                    <span className="text-surface-500">Duration</span>
                                    <span className="font-medium text-surface-800">{new Date(cert.startDate).toLocaleDateString()} - {new Date(cert.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-surface-500">Rating</span>
                                    <span className="font-bold text-amber-600">{cert.performanceRating}/10 ★</span>
                                </div>
                            </div>

                            <button onClick={() => handleDownload(cert._id)}
                                className="btn-primary w-full flex items-center justify-center gap-2">
                                <Download size={18} /> Download Certificate
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCertificates;
