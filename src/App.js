import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layout Components
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';

// Auth Components
import Login from './pages/Auth/Login';
import OwnerRegister from './pages/Auth/OwnerRegister';
import TenantRegister from './pages/Auth/TenantRegister';
import AdminRegister from './pages/Auth/AdminRegister';

// Owner Components
import OwnerDashboard from './pages/Owner/Dashboard';
import OwnerProperties from './pages/Owner/Properties';
import OwnerBookings from './pages/Owner/Bookings';
import OwnerComplaints from './pages/Owner/Complaints';
import OwnerTenants from './pages/Owner/Tenants';

// Tenant Components
import TenantDashboard from './pages/Tenant/Dashboard';
import TenantSearch from './pages/Tenant/Search';
import TenantBookings from './pages/Tenant/Bookings';
import TenantComplaints from './pages/Tenant/Complaints';
import TenantProfile from './pages/Tenant/Profile';

// Admin Components
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminBookings from './pages/Admin/Bookings';
import AdminComplaints from './pages/Admin/Complaints';
import AdminSettings from './pages/Admin/Settings';

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register/owner" element={<OwnerRegister />} />
                <Route path="register/tenant" element={<TenantRegister />} />
                <Route path="register/admin" element={<AdminRegister />} />
              </Route>

              {/* Owner Routes */}
              <Route path="/owner" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/owner/dashboard" replace />} />
                <Route path="dashboard" element={<OwnerDashboard />} />
                <Route path="properties" element={<OwnerProperties />} />
                <Route path="bookings" element={<OwnerBookings />} />
                <Route path="complaints" element={<OwnerComplaints />} />
                <Route path="tenants" element={<OwnerTenants />} />
              </Route>

              {/* Tenant Routes */}
              <Route path="/tenant" element={
                <ProtectedRoute allowedRoles={['tenant']}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/tenant/dashboard" replace />} />
                <Route path="dashboard" element={<TenantDashboard />} />
                <Route path="search" element={<TenantSearch />} />
                <Route path="bookings" element={<TenantBookings />} />
                <Route path="complaints" element={<TenantComplaints />} />
                <Route path="profile" element={<TenantProfile />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="complaints" element={<AdminComplaints />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/auth/login" replace />} />
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
