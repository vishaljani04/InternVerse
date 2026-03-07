import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-surface-50">
            <Sidebar />
            <main className="lg:ml-64 min-h-screen transition-all duration-300">
                <div className="p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
