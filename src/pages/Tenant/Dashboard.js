import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const TenantDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tenant Dashboard</h1>
        <p className="text-gray-600">Welcome to your personal dashboard</p>
      </div>
      
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/tenant/search" className="btn btn-primary text-center">Search Rooms</Link>
          <Link to="/tenant/bookings" className="btn btn-secondary text-center">My Bookings</Link>
          <Link to="/tenant/complaints" className="btn btn-secondary text-center">File Complaint</Link>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Booked Rooms</h2>
        <TenantBookingsPanel />
      </div>
    </div>
  );
};

const TenantBookingsPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsAPI.getMyBookings();
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Failed to fetch tenant bookings for dashboard:', err);
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      setLoading(true);
      const res = await bookingsAPI.cancelBooking(id);
      toast.success(res.data?.message || 'Booking cancelled');
      fetchBookings();
    } catch (err) {
      console.error('Cancel booking failed:', err);
      toast.error(err?.response?.data?.error || 'Cancel failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading your bookings...</p>;

  if (!bookings || bookings.length === 0) return <p className="text-gray-600">You have no bookings yet. Book a room to see it here.</p>;

  return (
    <div className="space-y-3">
      {bookings.map(b => (
        <div key={b.id} className="p-3 border rounded flex justify-between items-center">
          <div>
            <p className="font-medium">Room {b.rooms?.room_number} — {b.properties?.name}</p>
            <p className="text-sm text-gray-600">Move-in: {b.move_in_date ? new Date(b.move_in_date).toLocaleDateString() : '—'}</p>
            <p className="text-sm text-gray-600">Status: {b.status}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/tenant/bookings" className="btn btn-outline">Manage</Link>
            {b.status !== 'cancelled' && b.status !== 'approved' && (
              <button className="btn btn-secondary" onClick={() => cancelBooking(b.id)}>Cancel</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TenantDashboard;
