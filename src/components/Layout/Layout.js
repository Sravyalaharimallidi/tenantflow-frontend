import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationPanel from './NotificationPanel';
import AnimatedOutlet from './AnimatedOutlet';
import BackgroundAnimation from './BackgroundAnimation';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotificationPanel = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <BackgroundAnimation />
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Header */}
        <Header 
          onToggleSidebar={toggleSidebar}
          onToggleNotifications={toggleNotificationPanel}
          unreadCount={unreadCount}
          user={user}
          onLogout={handleLogout}
        />

        {/* Notification Panel */}
        <NotificationPanel 
          isOpen={notificationPanelOpen}
          onClose={() => setNotificationPanelOpen(false)}
        />

        {/* Page content */}
        <main className="p-6">
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
