import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchBookings = async (p = page) => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllBookings({ page: p, limit, status: filterStatus });
      setBookings(res.data.bookings || []);
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.pages || 1);
      }
    } catch (err) {
      console.error('Fetch all bookings error:', err);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(1); }, [filterStatus, limit]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
        <p className="text-gray-600">Monitor all booking activities</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm">Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input text-sm">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <label className="text-sm">Page size</label>
          <select value={limit} onChange={e => setLimit(parseInt(e.target.value))} className="input text-sm">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        {loading ? <p>Loading...</p> : (
          <div className="space-y-2">
            {bookings.map(b => (
              <div key={b.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <p className="font-medium">{b.rooms?.room_number} @ {b.properties?.name} <span className="text-xs text-gray-500">({b.rooms?.room_type})</span></p>
                  <p className="text-sm text-gray-600">Tenant: {b.tenants?.name} — Rent: ₹{b.rooms?.rent_amount} — Status: {b.status}</p>
                  <p className="text-sm text-gray-600">Move-in: {b.move_in_date ? new Date(b.move_in_date).toLocaleDateString() : '—'} — Created: {new Date(b.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm">View</button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <div>Page {page} of {totalPages}</div>
              <div className="flex gap-2">
                <button className="btn btn-sm" disabled={page <= 1} onClick={() => { setPage(p => { const np = p-1; fetchBookings(np); return np; }); }}>Prev</button>
                <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => { setPage(p => { const np = p+1; fetchBookings(np); return np; }); }}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
