import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsAPI.getOwnerBookings();
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Fetch owner bookings error:', err);
      toast.error('Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      setLoading(true);
      const res = await bookingsAPI.updateBookingStatus(bookingId, status);
      toast.success(res.data?.message || `Booking ${status}`);
      fetchBookings();
    } catch (err) {
      console.error('Update booking status failed:', err);
      toast.error(err?.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
        <p className="text-gray-600">Review and manage booking requests</p>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">No booking requests.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="p-4 border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{b.rooms?.room_number} — {b.properties?.name}</p>
                    <p className="text-sm text-gray-600">Tenant: {b.tenants?.name} — {b.tenants?.phone}</p>
                    <p className="text-sm text-gray-600">Status: {b.status}</p>
                  </div>
                  <div className="flex gap-2">
                    {b.status === 'pending' && (
                      <>
                        <button className="btn btn-primary" onClick={() => updateStatus(b.id, 'approved')}>Approve</button>
                        <button className="btn btn-secondary" onClick={() => updateStatus(b.id, 'rejected')}>Reject</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookings;
