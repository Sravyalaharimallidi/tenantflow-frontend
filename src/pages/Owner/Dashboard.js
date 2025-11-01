import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  MessageSquare, 
  Users, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ownersAPI, bookingsAPI, complaintsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await ownersAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentNotifications = dashboardData?.recentNotifications || [];

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, href, color }) => (
    <Link to={href} className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your properties.</p>
        </div>
        <Link
          to="/owner/properties"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={stats.propertiesCount || 0}
          icon={Building2}
          color="bg-blue-500"
        />
        <StatCard
          title="Available Rooms"
          value={stats.roomsStats?.available || 0}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings || 0}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Open Complaints"
          value={stats.pendingComplaints || 0}
          icon={AlertCircle}
          color="bg-red-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Manage Properties"
            description="Add new properties and manage existing ones"
            icon={Building2}
            href="/owner/properties"
            color="bg-blue-500"
          />
          <QuickActionCard
            title="Review Bookings"
            description="Approve or reject booking requests"
            icon={Calendar}
            href="/owner/bookings"
            color="bg-green-500"
          />
          <QuickActionCard
            title="Handle Complaints"
            description="Respond to tenant complaints"
            icon={MessageSquare}
            href="/owner/complaints"
            color="bg-orange-500"
          />
          <QuickActionCard
            title="Manage Tenants"
            description="View and manage tenant information"
            icon={Users}
            href="/owner/tenants"
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h2>
          <div className="card">
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Room Status Overview */}
      {stats.roomsStats && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Status Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">{stats.roomsStats.available || 0}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-red-600">{stats.roomsStats.occupied || 0}</div>
              <div className="text-sm text-gray-600">Occupied</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.roomsStats.reserved || 0}</div>
              <div className="text-sm text-gray-600">Reserved</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.roomsStats.maintenance || 0}</div>
              <div className="text-sm text-gray-600">Maintenance</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
