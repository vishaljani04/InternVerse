import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PortGuard from './components/common/PortGuard';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import BrowseInternships from './pages/BrowseInternships';
import InternshipDetail from './pages/InternshipDetail';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageInterns from './pages/admin/ManageInterns';
import ManageTasks from './pages/admin/ManageTasks';
import ManageEvaluations from './pages/admin/ManageEvaluations';
import ManageCertificates from './pages/admin/ManageCertificates';
import ManageUsers from './pages/admin/ManageUsers';
import ManageListings from './pages/admin/ManageListings';

// Common pages
import ManageApplications from './pages/common/ManageApplications';

// HR pages
import HRDashboard from './pages/hr/HRDashboard';

// Intern pages
import Profile from './pages/intern/Profile';
import MyApplications from './pages/intern/MyApplications';
import InternTasks from './pages/intern/InternTasks';
import InternEvaluations from './pages/intern/InternEvaluations';

function App() {
    useEffect(() => {
        const port = window.location.port;
        if (port === '5173') {
            document.title = 'InternVerse - Intern';
        } else if (port === '5174') {
            document.title = 'InternVerse - HR';
        } else if (port === '5175') {
            document.title = 'InternVerse - Admin';
        } else {
            document.title = 'InternVerse – Internship Management System';
        }
    }, []);

    return (
        <AuthProvider>
            <BrowserRouter>
                <PortGuard>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/admin" element={<AdminLogin />} />
                        <Route path="/internships" element={<BrowseInternships />} />
                        <Route path="/internships/:id" element={<InternshipDetail />} />
                        <Route path="/" element={<Navigate to="/internships" replace />} />

                        {/* Admin Dashboard Routes */}
                        <Route path="/admin/manage" element={
                            <ProtectedRoute roles={['admin']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="interns" element={<ManageInterns />} />
                            <Route path="tasks" element={<ManageTasks />} />
                            <Route path="evaluations" element={<ManageEvaluations />} />
                            <Route path="certificates" element={<ManageCertificates />} />
                            <Route path="users" element={<ManageUsers />} />
                            <Route path="listings" element={<ManageListings />} />
                            <Route path="applications" element={<ManageApplications />} />
                        </Route>

                        {/* HR Routes */}
                        <Route path="/hr" element={
                            <ProtectedRoute roles={['hr', 'admin']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="dashboard" element={<HRDashboard />} />
                            <Route path="interns" element={<ManageInterns />} />
                            <Route path="tasks" element={<ManageTasks />} />
                            <Route path="evaluations" element={<ManageEvaluations />} />
                            <Route path="certificates" element={<ManageCertificates />} />
                            <Route path="listings" element={<ManageListings />} />
                            <Route path="applications" element={<ManageApplications />} />
                        </Route>

                        {/* Intern Routes */}
                        <Route path="/intern" element={
                            <ProtectedRoute roles={['intern']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="profile" element={<Profile />} />
                            <Route path="applications" element={<MyApplications />} />
                            <Route path="tasks" element={<InternTasks />} />
                            <Route path="performance" element={<InternEvaluations />} />
                        </Route>

                        {/* Catch all */}
                        <Route path="*" element={<Navigate to="/internships" replace />} />
                    </Routes>
                </PortGuard>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
