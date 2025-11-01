import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);

  useEffect(() => {
    const fetchApprovalRequests = async () => {
      try {
        const response = await axios.get('/api/auth/approval-requests');
        setApprovalRequests(response.data.requests);
      } catch (error) {
        console.error('Error fetching approval requests:', error);
      }
    };

    fetchApprovalRequests();
  }, []);

  const handleApproval = async (id, action) => {
    try {
      await axios.post(`/api/auth/approval-requests/${id}`, { action });
      setApprovalRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, bookings, complaints, and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <p className="text-gray-600">View and manage all users</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
          <p className="text-gray-600">Monitor and manage bookings</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900">Complaints</h2>
          <p className="text-gray-600">Track and resolve complaints</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <p className="text-gray-600">Configure system settings</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900">Approval Requests</h2>
          <p className="text-gray-600">Approve or reject pending owner requests</p>
          <ul className="space-y-4 mt-4">
            {approvalRequests.map((request) => (
              <li key={request.id} className="flex justify-between items-center border p-4 rounded">
                <div>
                  <p className="text-gray-900 font-medium">{request.email}</p>
                  <p className="text-gray-600 text-sm">Requested on: {new Date(request.created_at).toLocaleString()}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleApproval(request.id, 'approve')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(request.id, 'reject')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
