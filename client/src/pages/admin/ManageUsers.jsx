import { useState, useEffect } from 'react';
import { Search, Shield } from 'lucide-react';
import api from '../../services/api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => { fetchUsers(); }, [search, roleFilter]);

    const fetchUsers = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;
            const { data } = await api.get('/users', { params });
            setUsers(data.users);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const roleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-700';
            case 'hr': return 'bg-blue-100 text-blue-700';
            default: return 'bg-emerald-100 text-emerald-700';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-surface-900">Users & HR</h1>
                <p className="text-surface-500 mt-1">View all registered users and HR accounts</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11" />
                </div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field w-auto min-w-[140px]">
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="hr">HR</option>
                    <option value="intern">Intern</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div></div>
            ) : users.length === 0 ? (
                <div className="glass-card p-12 text-center"><p className="text-surface-400 text-lg">No users found</p></div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-surface-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase">Department</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-50">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-surface-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-semibold">{u.name?.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-surface-800">{u.name}</p>
                                                    <p className="text-xs text-surface-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${roleColor(u.role)}`}>
                                                <Shield size={12} className="mr-1" />{u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-surface-600">{u.department || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-surface-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
