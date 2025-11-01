import React, { useEffect, useState } from 'react';
import { complaintsAPI, tenantsAPI, propertiesAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const TenantComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ complaintType: '', title: '', description: '', priority: 'medium', roomId: '', propertyId: '' });
  const [propertyRooms, setPropertyRooms] = useState([]);
  const [propertiesList, setPropertiesList] = useState([]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await complaintsAPI.getMyComplaints();
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error('Fetch complaints failed:', err);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all properties (derive from available rooms)
  const fetchAllProperties = async () => {
    try {
      const res = await propertiesAPI.getAvailableRooms();
      const rooms = res.data.rooms || [];
      const map = new Map();
      rooms.forEach(r => {
        const prop = r.properties;
        if (!prop) return;
        if (!map.has(prop.id)) map.set(prop.id, { id: prop.id, name: prop.name, rooms: [] });
        map.get(prop.id).rooms.push({ id: r.id, room_number: r.room_number, room_type: r.room_type });
      });
      setPropertiesList(Array.from(map.values()));
    } catch (err) {
      console.debug('Could not fetch properties for complaints', err);
    }
  };

  useEffect(() => { fetchComplaints(); fetchAllProperties(); }, []);

  const submitComplaint = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        complaintType: form.complaintType,
        title: form.title,
        description: form.description,
        priority: form.priority,
      };
      // propertyId and roomId are required by server
      payload.roomId = form.roomId;
      payload.propertyId = form.propertyId;

      const res = await complaintsAPI.fileComplaint(payload);
      toast.success(res.data?.message || 'Complaint filed');
  setForm({ complaintType: '', title: '', description: '', priority: 'medium', roomId: '', propertyId: form.propertyId || '' });
      fetchComplaints();
    } catch (err) {
      console.error('File complaint failed:', err);
      const serverData = err?.response?.data;
      if (serverData?.errors) {
        toast.error(serverData.errors.map(e => e.msg).join('\n'));
      } else if (serverData?.error) {
        toast.error(serverData.error);
      } else {
        toast.error('Failed to file complaint');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
        <p className="text-gray-600">File and track your complaints</p>
      </div>

      <div className="card">
        <form onSubmit={submitComplaint} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input className="input w-full" value={form.complaintType} onChange={e => setForm({...form, complaintType: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input className="input w-full" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea className="input w-full" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select className="input w-full" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Property</label>
              <input className="input w-full" value={form.propertyName} onChange={e => setForm({...form, propertyName: e.target.value})} placeholder="Property Name" required />
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Room (select)</label>
            {propertyRooms.length > 0 ? (
              <select className="input w-full" value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})} required>
                <option value="">Select room</option>
                {propertyRooms.map(r => (
                  <option key={r.id} value={r.id}>{r.room_number} — {r.room_type}</option>
                ))}
              </select>
            ) : (
              <input className="input w-full" value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})} placeholder="Room UUID" required />
            )}
          </div>
          <div className="flex justify-end">
            <button className="btn btn-primary" type="submit">File Complaint</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Your Complaints</h2>
        {loading ? <p>Loading...</p> : complaints.length === 0 ? (
          <p className="text-gray-600">You have not filed any complaints yet.</p>
        ) : (
          <div className="space-y-3">
            {complaints.map(c => (
              <div key={c.id} className="p-3 border rounded">
                <p className="font-medium">{c.title} — {c.priority}</p>
                <p className="text-sm text-gray-600">Status: {c.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantComplaints;
