import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Edit, Trash2, Eye, Navigation, X } from 'lucide-react';
import { propertiesAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AddPropertyModal = ({ isOpen, onClose, onPropertyAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    description: '',
    // latitude: '', // TODO: Enable after database migration
    // longitude: '', // TODO: Enable after database migration
    amenities: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await propertiesAPI.addProperty(formData);
      toast.success('Property added successfully!');
      onPropertyAdded();
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        description: '',
        // latitude: '', // TODO: Enable after database migration
        // longitude: '', // TODO: Enable after database migration
        amenities: []
      });
    } catch (error) {
      console.error('Failed to add property:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Property</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
              placeholder="Enter property name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="input"
              rows="3"
              placeholder="Enter full address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="input"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="input"
                placeholder="State"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="input"
              placeholder="Pincode"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows="3"
              placeholder="Property description (optional)"
            />
          </div>

          {/* Location Coordinates - TODO: Enable after database migration */}
          {/* <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Location Coordinates (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="input"
                  placeholder="12.9716"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="input"
                  placeholder="77.5946"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Get coordinates from Google Maps. Example: Bangalore is 12.9716, 77.5946
            </p>
          </div> */}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Adding...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddRoomModal = ({ isOpen, onClose, propertyId, onRoomAdded }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    rentAmount: '',
    depositAmount: '',
    amenities: []
  });
  const [loading, setLoading] = useState(false);

  const normalizeRoomData = (data) => ({
    ...data,
    rentAmount: data.rentAmount ? data.rentAmount.toString() : '',
    depositAmount: data.depositAmount ? data.depositAmount.toString() : '',
    amenities: Array.isArray(data.amenities) ? data.amenities : (typeof data.amenities === 'string' && data.amenities.trim() !== '' ? data.amenities.split(',').map(a => a.trim()) : []),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanData = normalizeRoomData(formData);
      await propertiesAPI.addRoom(propertyId, cleanData);
      toast.success('Room added successfully!');
      onRoomAdded();
      setFormData({
        roomNumber: '',
        roomType: '',
        rentAmount: '',
        depositAmount: '',
        amenities: []
      });
    } catch (error) {
      console.error('Failed to add room:', error);
      console.error('Error response:', error.response?.data);
      toast.error(
        error.response?.data?.error ||
        (Array.isArray(error.response?.data?.errors) && error.response.data.errors[0]?.msg) ||
        'Failed to add room'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Room</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                required
                className="input"
                placeholder="101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select type</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Quad">Quad</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount *</label>
              <input
                type="number"
                name="rentAmount"
                value={formData.rentAmount}
                onChange={handleChange}
                required
                className="input"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount</label>
              <input
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleChange}
                className="input"
                placeholder="10000"
              />
            </div>
          </div>

          {/* Room Location Coordinates */}
          {/* <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Room Location Coordinates (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="input"
                  placeholder="12.9716"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="input"
                  placeholder="77.5946"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Room-specific coordinates for precise location-based search
            </p>
          </div> */}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Adding...' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OwnerProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showCoordinates, setShowCoordinates] = useState({});

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesAPI.getMyProperties();
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = (propertyId) => {
    setSelectedProperty(propertyId);
    setShowAddRoom(true);
  };

  const handleAddProperty = () => {
    setShowAddProperty(true);
  };

  const handlePropertyAdded = () => {
    setShowAddProperty(false);
    fetchProperties(); // Refresh the properties list
  };

  const handleRoomAdded = () => {
    setShowAddRoom(false);
    fetchProperties(); // Refresh the properties list
  };

  const handleUpdateCoordinates = async (roomId, coordinates) => {
    try {
      await propertiesAPI.updateRoomCoordinates(roomId, coordinates);
      toast.success('Room coordinates updated successfully');
      fetchProperties(); // Refresh data
    } catch (error) {
      console.error('Failed to update coordinates:', error);
      toast.error('Failed to update room coordinates');
    }
  };

  const RoomCard = ({ room, propertyId }) => (
    <div className="card bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900">Room {room.room_number}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${
              room.status === 'available' ? 'bg-green-100 text-green-800' :
              room.status === 'occupied' ? 'bg-red-100 text-red-800' :
              room.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {room.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Type: {room.room_type}</p>
          <p className="text-sm text-gray-600">Rent: ₹{room.rent_amount}/month</p>
          {room.deposit_amount && (
            <p className="text-sm text-gray-600">Deposit: ₹{room.deposit_amount}</p>
          )}
          {room.latitude && room.longitude && (
            <p className="text-xs text-blue-600 mt-1">
              📍 {room.latitude}, {room.longitude}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          {(!room.latitude || !room.longitude) && (
            <button
              onClick={() => setShowCoordinates(prev => ({ ...prev, [room.id]: true }))}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              <Navigation className="h-4 w-4" />
            </button>
          )}
          <button className="text-gray-400 hover:text-gray-600">
            <Edit className="h-4 w-4" />
          </button>
          <button className="text-red-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const PropertyCard = ({ property }) => (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{property.name}</h2>
          <p className="text-gray-600">{property.address}</p>
          <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
          {property.latitude && property.longitude && (
            <p className="text-xs text-blue-600 mt-1">
              📍 {property.latitude}, {property.longitude}
            </p>
          )}
        </div>
        <button
          onClick={() => handleAddRoom(property.id)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Room</span>
        </button>
      </div>

      {/* Rooms List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Rooms ({property.rooms?.length || 0})</h3>
        {property.rooms && property.rooms.length > 0 ? (
          <div className="space-y-3">
            {property.rooms.map((room) => (
              <RoomCard key={room.id} room={room} propertyId={property.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No rooms added yet</p>
            <button
              onClick={() => handleAddRoom(property.id)}
              className="text-blue-600 hover:text-blue-800 font-medium mt-2"
            >
              Add your first room
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600">Manage your properties and rooms with location coordinates</p>
        </div>
        <button 
          onClick={handleAddProperty}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first property</p>
          <button 
            onClick={handleAddProperty}
            className="btn btn-primary"
          >
            Add Property
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Location Help */}
      <div className="card bg-blue-50">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Location Coordinates</h3>
            <p className="text-sm text-blue-700 mt-1">
              Adding latitude and longitude coordinates to your properties and rooms enables location-based search for tenants. 
              You can find coordinates using Google Maps or other mapping services.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Example: Bangalore coordinates are approximately 12.9716, 77.5946
            </p>
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      <AddPropertyModal 
        isOpen={showAddProperty}
        onClose={() => setShowAddProperty(false)}
        onPropertyAdded={handlePropertyAdded}
      />

      {/* Add Room Modal */}
      <AddRoomModal 
        isOpen={showAddRoom}
        onClose={() => setShowAddRoom(false)}
        propertyId={selectedProperty}
        onRoomAdded={handleRoomAdded}
      />
    </div>
  );
};

export default OwnerProperties;