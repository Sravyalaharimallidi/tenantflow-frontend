import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings,
  Search,
  FileText,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const location = useLocation();
  const { isOwner, isTenant, isAdmin } = useAuth();

  const getNavigationItems = () => {
    if (isOwner) {
      return [
        { name: 'Dashboard', href: '/owner/dashboard', icon: Home },
        { name: 'Properties', href: '/owner/properties', icon: Building2 },
        { name: 'Bookings', href: '/owner/bookings', icon: Calendar },
        { name: 'Complaints', href: '/owner/complaints', icon: MessageSquare },
        { name: 'Tenants', href: '/owner/tenants', icon: Users },
      ];
    } else if (isTenant) {
      return [
        { name: 'Dashboard', href: '/tenant/dashboard', icon: Home },
        { name: 'Search Rooms', href: '/tenant/search', icon: Search },
        { name: 'My Bookings', href: '/tenant/bookings', icon: Calendar },
        { name: 'Complaints', href: '/tenant/complaints', icon: MessageSquare },
        { name: 'Profile', href: '/tenant/profile', icon: User },
      ];
    } else if (isAdmin) {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
        { name: 'Complaints', href: '/admin/complaints', icon: MessageSquare },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isOwner ? 'Owner Panel' : isTenant ? 'Tenant Panel' : 'Admin Panel'}
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Adjusted User Info Styling */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
