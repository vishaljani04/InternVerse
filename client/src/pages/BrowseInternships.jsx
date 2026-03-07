import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, DollarSign, Briefcase, Filter, ChevronRight, BarChart3, X, Zap, Globe, Building2, Calendar, UserCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import PublicNavbar from '../components/layout/PublicNavbar';

const BrowseInternships = () => {
    const [listings, setListings] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'hr') {
                navigate('/hr/dashboard');
            } else if (user?.role === 'admin') {
                navigate('/admin/manage/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => { fetchListings(); }, [search, deptFilter, typeFilter, page]);

    const fetchListings = async () => {
        try {
            const params = { page, limit: 12 };
            if (search) params.search = search;
            if (deptFilter) params.department = deptFilter;
            if (typeFilter) params.type = typeFilter;
            const { data } = await api.get('/listings/public', { params });
            setListings(data.listings);
            setDepartments(data.departments || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const typeLabel = (t) => {
        switch (t) {
            case 'remote': return { text: 'Remote', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: Globe };
            case 'onsite': return { text: 'On-site', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Building2 };
            case 'hybrid': return { text: 'Hybrid', color: 'bg-purple-50 text-purple-700 border-purple-100', icon: MapPin };
            default: return { text: t, color: 'bg-surface-50 text-surface-600 border-surface-100', icon: Briefcase };
        }
    };

    const clearFilters = () => {
        setSearch('');
        setDeptFilter('');
        setTypeFilter('');
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-surface-50 flex flex-col">
            {/* Navbar */}
            <PublicNavbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-accent-800 relative overflow-hidden py-16 md:py-24">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-400 rounded-full blur-[120px] opacity-20"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-400 rounded-full blur-[120px] opacity-20"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-primary-100 text-sm font-medium mb-6 animate-fade-in">
                        🚀 Over 10,000 students joined this month
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Find Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-100">Internship</span>
                    </h1>
                    <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed opacity-90">
                        The ultimate platform to discover, apply, and launch your professional journey with top companies worldwide.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-accent-400 to-primary-400 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                            <div className="relative flex items-center">
                                <Search size={22} className="absolute left-6 text-surface-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    placeholder="Search by title, company, skills or keywords..."
                                    className="w-full pl-16 pr-6 py-5 bg-white rounded-2xl text-surface-800 placeholder-surface-400 shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-lg transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content with Sidebar */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-72 shrink-0 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-surface-900 flex items-center gap-2">
                                    <Filter size={18} className="text-primary-500" />
                                    Filter Tools
                                </h3>
                                {(deptFilter || typeFilter) && (
                                    <button onClick={clearFilters} className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded-md">
                                        Reset
                                    </button>
                                )}
                            </div>

                            {/* Department Filter */}
                            <div className="mb-8 p-6 bg-white rounded-2xl border border-surface-200 shadow-sm">
                                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-4">Department</label>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => { setDeptFilter(''); setPage(1); }}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${!deptFilter ? 'bg-primary-500 text-white font-semibold' : 'text-surface-600 hover:bg-surface-50'}`}
                                    >
                                        All Departments
                                    </button>
                                    {departments.map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => { setDeptFilter(d); setPage(1); }}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${deptFilter === d ? 'bg-primary-500 text-white font-semibold shadow-glow' : 'text-surface-600 hover:bg-surface-50'}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Job Type Filter */}
                            <div className="p-6 bg-white rounded-2xl border border-surface-200 shadow-sm">
                                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-4">Work Style</label>
                                <div className="space-y-3">
                                    {['', 'remote', 'onsite', 'hybrid'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => { setTypeFilter(type); setPage(1); }}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between group ${typeFilter === type ? 'bg-primary-500 text-white font-semibold shadow-glow' : 'text-surface-600 hover:bg-surface-50'}`}
                                        >
                                            <span className="capitalize">{type || 'All Styles'}</span>
                                            <div className={`w-2 h-2 rounded-full ${typeFilter === type ? 'bg-white' : 'bg-surface-200 group-hover:bg-primary-300'}`}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Promo Card */}
                        <div className="p-6 bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl text-white shadow-xl shadow-primary-200 relative overflow-hidden group">
                            <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                            <h4 className="font-bold mb-2 relative z-10">Get Matched Faster</h4>
                            <p className="text-xs text-primary-100 mb-4 opacity-90 relative z-10 leading-relaxed">Complete your profile to get personalized internship recommendations.</p>
                            <Link to="/intern/profile" className="inline-block w-full py-2 bg-white text-primary-600 rounded-xl text-xs font-bold text-center hover:bg-primary-50 transition-colors relative z-10">
                                Complete Profile
                            </Link>
                        </div>
                    </aside>

                    {/* Listings Area */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-surface-900">Recommended For You</h2>
                                <p className="text-surface-500 text-sm font-medium mt-1">
                                    Found <span className="text-primary-600">{listings.length}</span> internships matching your criteria
                                </p>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="lg:hidden p-2.5 bg-white border border-surface-200 rounded-xl text-surface-600 hover:text-primary-600"
                            >
                                <Filter size={20} />
                            </button>

                            {/* Desktop Sort Dropdown placeholder */}
                            <div className="hidden sm:block">
                                <select className="bg-transparent border-none text-sm font-semibold text-surface-500 focus:ring-0 cursor-pointer hover:text-primary-600 transition-colors capitalize">
                                    <option>Newest First</option>
                                    <option>Closing Soon</option>
                                </select>
                            </div>
                        </div>

                        {/* Listings List (Rectangles) */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-surface-100"></div>
                                    ))}
                                </div>
                            ) : listings.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-surface-200">
                                    <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Briefcase size={28} className="text-surface-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-surface-700 mb-2 font-display">No Matches Found</h3>
                                    <p className="text-surface-400 mb-6 max-w-sm mx-auto">We couldn't find any internships matching your current filters. Try relaxing your search criteria.</p>
                                    <button onClick={clearFilters} className="btn-primary text-sm px-8">Clear All Filters</button>
                                </div>
                            ) : (
                                listings.map((listing) => {
                                    const tp = typeLabel(listing.type);
                                    const TypeIcon = tp.icon;
                                    return (
                                        <Link
                                            key={listing._id}
                                            to={`/internships/${listing._id}`}
                                            className="group block bg-white rounded-3xl border border-surface-200 p-4 md:p-6 hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-100 transition-all duration-300 relative overflow-hidden"
                                        >
                                            {/* Accent hover background */}
                                            <div className="absolute right-0 top-0 w-24 h-24 bg-primary-50 group-hover:scale-[3] opacity-0 group-hover:opacity-100 rounded-full transition-all duration-700 -z-0 pointer-events-none"></div>

                                            <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                                {/* Left: Content */}
                                                <div className="flex-1">
                                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="text-xl md:text-2xl font-bold text-surface-900 group-hover:text-primary-700 transition-colors">
                                                                    {listing.title}
                                                                </h3>
                                                                <Zap size={16} className="text-accent-500 fill-accent-500 animate-pulse hidden sm:block" />
                                                            </div>
                                                            <p className="font-bold text-primary-600 flex items-center gap-2">
                                                                {listing.company}
                                                                <span className="w-1 h-1 bg-surface-300 rounded-full"></span>
                                                                <span className="text-surface-400 text-sm font-medium uppercase tracking-wider">{listing.department}</span>
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border md:hidden ${tp.color}`}>
                                                                {tp.text}
                                                            </div>
                                                            <div className={`hidden md:flex p-2 rounded-xl items-center gap-2 border ${tp.color} text-xs font-bold uppercase`}>
                                                                <TypeIcon size={14} />
                                                                {tp.text}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-y-3 gap-x-6 mb-6">
                                                        <div className="flex items-center gap-2 text-surface-500 text-sm font-medium">
                                                            <MapPin size={16} className="text-surface-400" /> <span>{listing.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-surface-500 text-sm font-medium">
                                                            <Clock size={16} className="text-surface-400" /> <span>{listing.duration}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-primary-600 text-sm font-bold">
                                                            <DollarSign size={16} /> <span>{listing.stipend}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-surface-500 text-sm font-medium">
                                                            <Calendar size={16} className="text-surface-400" />
                                                            <span>Deadline: <span className="text-surface-900 font-semibold">{new Date(listing.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {listing.skills?.slice(0, 5).map((s, i) => (
                                                            <span key={i} className="px-3 py-1 bg-surface-50 text-surface-600 text-[11px] font-bold border border-surface-200 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors uppercase tracking-tight">
                                                                {s}
                                                            </span>
                                                        ))}
                                                        {listing.skills?.length > 5 && (
                                                            <span className="px-3 py-1 bg-surface-50 text-surface-400 text-[11px] font-bold border border-surface-200 rounded-lg italic">
                                                                +{listing.skills.length - 5} others
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right: Action Area (Desktop) */}
                                                <div className="hidden lg:flex flex-col items-end justify-between py-1">
                                                    <div className="w-10 h-10 rounded-full border border-surface-100 flex items-center justify-center text-surface-300 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all duration-300">
                                                        <ChevronRight size={20} />
                                                    </div>
                                                    <div className="text-xs text-surface-400 font-medium whitespace-nowrap">
                                                        Posted 2 days ago
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-3 mt-12 mb-8">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => { setPage(p); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                                        className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all shadow-sm ${page === p ? 'bg-primary-500 text-white shadow-glow' : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Filter Overlay */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
                    <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl flex flex-col animate-slide-right">
                        <div className="p-6 border-b border-surface-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-surface-900">Filters</h3>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-surface-50 rounded-lg">
                                <X size={20} className="text-surface-400" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Mobile Filters Content (Clone of Desktop) */}
                            <div>
                                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-4">Department</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <button onClick={() => { setDeptFilter(''); setPage(1); setIsMobileFilterOpen(false); }}
                                        className={`px-4 py-3 rounded-xl text-left text-sm ${!deptFilter ? 'bg-primary-500 text-white font-bold' : 'bg-surface-50 text-surface-700'}`}>
                                        All Departments
                                    </button>
                                    {departments.map((d) => (
                                        <button key={d} onClick={() => { setDeptFilter(d); setPage(1); setIsMobileFilterOpen(false); }}
                                            className={`px-4 py-3 rounded-xl text-left text-sm ${deptFilter === d ? 'bg-primary-500 text-white font-bold' : 'bg-surface-50 text-surface-700'}`}>
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-4">Work Style</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['', 'remote', 'onsite', 'hybrid'].map((type) => (
                                        <button key={type} onClick={() => { setTypeFilter(type); setPage(1); setIsMobileFilterOpen(false); }}
                                            className={`px-4 py-3 rounded-xl text-left text-sm capitalize ${typeFilter === type ? 'bg-primary-500 text-white font-bold' : 'bg-surface-50 text-surface-700'}`}>
                                            {type || 'All Styles'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-surface-100 bg-surface-50">
                            <button onClick={() => { clearFilters(); setIsMobileFilterOpen(false); }} className="w-full py-4 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl border border-red-100 transition-colors">
                                Reset All Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BrowseInternships;
