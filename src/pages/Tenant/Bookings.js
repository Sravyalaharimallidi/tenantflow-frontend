import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const TenantBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsAPI.getMyBookings();
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      const res = await bookingsAPI.cancelBooking(bookingId);
      toast.success(res.data?.message || 'Booking cancelled');
      fetchBookings();
    } catch (err) {
      console.error('Cancel booking failed:', err);
      toast.error(err?.response?.data?.error || 'Cancel failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">View and manage your room bookings</p>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">You have no bookings.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="p-4 border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{b.rooms?.room_number} — {b.properties?.name}</p>
                    <p className="text-sm text-gray-600">{b.move_in_date ? new Date(b.move_in_date).toLocaleDateString() : ''} </p>
                    <p className="text-sm text-gray-600">Status: {b.status}</p>
                  </div>
                  <div>
                    {b.status !== 'cancelled' && (
                      <button className="btn btn-secondary" onClick={() => cancelBooking(b.id)}>Cancel</button>
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

export default TenantBookings;
