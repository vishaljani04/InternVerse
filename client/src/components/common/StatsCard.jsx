import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ icon: Icon, label, value, trend, trendValue, color = 'primary', index = 0 }) => {
    const colors = {
        primary: 'from-primary-500 to-primary-600',
        accent: 'from-accent-500 to-accent-600',
        emerald: 'from-emerald-500 to-emerald-600',
        amber: 'from-amber-500 to-amber-600',
        rose: 'from-rose-500 to-rose-600',
        blue: 'from-blue-500 to-blue-600',
        cyan: 'from-cyan-500 to-cyan-600',
        violet: 'from-violet-500 to-violet-600',
    };

    const bgColors = {
        primary: 'bg-primary-50',
        accent: 'bg-accent-50',
        emerald: 'bg-emerald-50',
        amber: 'bg-amber-50',
        rose: 'bg-rose-50',
        blue: 'bg-blue-50',
        cyan: 'bg-cyan-50',
        violet: 'bg-violet-50',
    };

    return (
        <div
            className="glass-card p-6 hover:shadow-card-hover transition-all duration-300 animate-slide-up group"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-surface-500 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-surface-900">{value}</p>
                    {trendValue && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 ${bgColors[color]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center`}>
                        {Icon && <Icon size={16} className="text-white" />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
