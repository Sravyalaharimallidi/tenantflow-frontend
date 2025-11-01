import React from 'react';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onToggleSidebar, onToggleNotifications, unreadCount, user, onLogout }) => {
  const { isOwner, isTenant, isAdmin } = useAuth();

  const getUserDisplayName = () => {
    if (isOwner && user?.owner) {
      return user.owner.name;
    } else if (isTenant && user?.tenant) {
      return user.tenant.name;
    } else if (isAdmin) {
      return 'Admin';
    }
    return user?.email || 'User';
  };

  const getUserRole = () => {
    return user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <img src="/tenantflow-icon.png" alt="TenantFlow" className="h-10 w-10 object-contain rounded" onError={(e)=>{e.target.style.display='none'}} />
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-900">
                {isOwner ? 'Owner Dashboard' : isTenant ? 'Tenant Dashboard' : 'Admin Dashboard'}
              </h1>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            onClick={onToggleNotifications}
            className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
              <p className="text-xs text-gray-500">{getUserRole()}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              
              <button
                onClick={onLogout}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
