import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRole, setFilterRole] = useState('');

  const fetchUsers = async (p = page) => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers({ page: p, limit, role: filterRole });
      setUsers(res.data.users || []);
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.pages || 1);
      }
    } catch (err) {
      console.error('Fetch admin users error:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(1); }, [filterRole, limit]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage owners, tenants, and system users</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm">Role</label>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="input text-sm">
            <option value="">All</option>
            <option value="tenant">Tenant</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
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
            {users.map(u => (
              <div key={u.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <p className="font-medium">{u.name || u.email} <span className="text-xs text-gray-500">({u.role})</span></p>
                  <p className="text-sm text-gray-600">Email: {u.email} — Phone: {u.phone || '—'}</p>
                  <p className="text-sm text-gray-600">Verification: {u.verification_status || '—'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm">View</button>
                  <button className="btn btn-sm btn-danger">Disable</button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <div>Page {page} of {totalPages}</div>
              <div className="flex gap-2">
                <button className="btn btn-sm" disabled={page <= 1} onClick={() => { setPage(p => { const np = p-1; fetchUsers(np); return np; }); }}>Prev</button>
                <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => { setPage(p => { const np = p+1; fetchUsers(np); return np; }); }}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
