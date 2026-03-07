import { Zap } from 'lucide-react';

const Logo = ({ size = 24, className = "" }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 transform group-hover:scale-105 transition-transform">
                <Zap size={size} className="text-white fill-current" />
            </div>
        </div>
        <span className="font-bold text-surface-900 text-xl tracking-tight hidden sm:inline-block">InternVerse</span>
    </div>
);

export default Logo;
