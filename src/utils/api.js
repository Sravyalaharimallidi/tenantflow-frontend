import axios from 'axios';

// Configure base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://tenantflow-backend-i7on.onrender.com/api';


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials, userType) => {
    const endpoint = userType === 'admin' ? '/auth/login/admin' : 
                    userType === 'owner' ? '/auth/login/owner' : 
                    '/auth/login/tenant';
    return api.post(endpoint, credentials);
  },

  // Role-based registration endpoints
  registerOwner: (userData) => api.post('/auth/register/owner', userData),
  registerTenant: (userData) => api.post('/auth/register/tenant', userData),
  registerAdmin: (userData) => api.post('/auth/register/admin', userData),

  verify: () => api.get('/auth/verify'),

  logout: () => api.post('/auth/logout'),
};

export const propertiesAPI = {
  getMyProperties: () => api.get('/properties/my-properties'),
  
  addProperty: (propertyData) => api.post('/properties/add-property', propertyData),
  
  updateProperty: (propertyId, data) => api.put(`/properties/update-property/${propertyId}`, data),
  
  addRoom: (propertyId, roomData) => api.post(`/properties/add-room/${propertyId}`, roomData),
  
  updateRoomStatus: (roomId, status) => api.put(`/properties/update-room-status/${roomId}`, { status }),
  
  updateRoomCoordinates: (roomId, coordinates) => api.put(`/properties/update-room-coordinates/${roomId}`, coordinates),
  
  uploadImages: (propertyId, formData) => api.post(`/properties/upload-images/${propertyId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  getAvailableRooms: (filters = {}) => api.get('/properties/available-rooms', { params: filters }),
  
  searchRoomsNearby: (latitude, longitude, radius = 10, additionalFilters = {}) => 
    api.get('/properties/available-rooms', { 
      params: { 
        latitude, 
        longitude, 
        radius, 
        ...additionalFilters 
      } 
    }),
};

export const bookingsAPI = {
  bookRoom: (bookingData) => api.post('/bookings/book-room', bookingData),
  
  getMyBookings: () => api.get('/bookings/my-bookings'),
  
  getOwnerBookings: () => api.get('/bookings/owner-bookings'),
  
  updateBookingStatus: (bookingId, status, notes) => 
    api.put(`/bookings/booking/${bookingId}/status`, { status, notes }),
  
  cancelBooking: (bookingId) => api.put(`/bookings/booking/${bookingId}/cancel`),
  
  getAllBookings: (filters = {}) => api.get('/bookings/all-bookings', { params: filters }),
};

export const complaintsAPI = {
  fileComplaint: (complaintData) => api.post('/complaints/file-complaint', complaintData),
  
  getMyComplaints: () => api.get('/complaints/my-complaints'),
  
  getOwnerComplaints: () => api.get('/complaints/owner-complaints'),
  
  updateComplaintStatus: (complaintId, status, response) => 
    api.put(`/complaints/complaint/${complaintId}/status`, { status, response }),
  
  getAllComplaints: (filters = {}) => api.get('/complaints/all-complaints', { params: filters }),
  
  addAdminNotes: (complaintId, notes) => 
    api.put(`/complaints/complaint/${complaintId}/admin-notes`, { notes }),
  
  getComplaintStats: () => api.get('/complaints/complaint-stats'),
};

export const tenantsAPI = {
  getProfile: () => api.get('/tenants/profile'),
  
  updateProfile: (profileData) => api.put('/tenants/profile', profileData),
  
  uploadIdProof: (formData) => api.post('/tenants/upload-id-proof', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  getOwnerTenants: () => api.get('/tenants/owner-tenants'),
  
  updateTenantProfile: (tenantId, profileData) => 
    api.put(`/tenants/tenant/${tenantId}/profile`, profileData),
  
  getAllTenants: (filters = {}) => api.get('/tenants/all-tenants', { params: filters }),
  
  getTenantStats: () => api.get('/tenants/tenant-stats'),
};

export const ownersAPI = {
  getProfile: () => api.get('/owners/profile'),
  
  updateProfile: (profileData) => api.put('/owners/profile', profileData),
  
  getAllOwners: (filters = {}) => api.get('/owners/all-owners', { params: filters }),
  
  updateVerification: (ownerId, status, notes) => 
    api.put(`/owners/owner/${ownerId}/verification`, { status, notes }),
  
  getOwnerStats: () => api.get('/owners/owner-stats'),
  
  getDashboard: () => api.get('/owners/dashboard'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  getUsers: (filters = {}) => api.get('/admin/users', { params: filters }),

  updateUserStatus: (userId, isActive, notes) => 
    api.put(`/admin/user/${userId}/status`, { isActive, notes }),
  
  createBackup: () => api.post('/admin/backup'),
  
  restoreBackup: (backupData, confirmRestore) => 
    api.post('/admin/restore', { backupData, confirmRestore }),
  
  getSettings: () => api.get('/admin/settings'),
  
  updateSettings: (settings) => api.put('/admin/settings', { settings }),
  
  getAuditLogs: (filters = {}) => api.get('/admin/audit-logs', { params: filters }),
};

export const notificationsAPI = {
  getMyNotifications: (filters = {}) => api.get('/notifications/my-notifications', { params: filters }),
  
  markAsRead: (notificationId) => api.put(`/notifications/notification/${notificationId}/read`),
  
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  
  sendNotification: (notificationData) => api.post('/notifications/send-notification', notificationData),
  
  sendBulkNotification: (bulkData) => api.post('/notifications/send-bulk-notification', bulkData),
  
  getNotificationStats: () => api.get('/notifications/notification-stats'),
};

export default api;
