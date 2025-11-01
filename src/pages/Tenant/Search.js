import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Search, MapPin, DollarSign, Home, Users, Star, Calendar, Navigation, Map } from 'lucide-react';
import { propertiesAPI, bookingsAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

const TenantSearch = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('rent');
  const [sortOrder, setSortOrder] = useState('asc');
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [searchCenter, setSearchCenter] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      location: '',
      minRent: '',
      maxRent: '',
      roomType: '',
      latitude: '',
      longitude: '',
      radius: 10
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    // only request location permission on mount; do NOT auto-fetch results
    requestLocationPermission();
  }, []);

  // No automatic refetch: searches run only when the user submits the form

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setLocationPermission('granted');
          setValue('latitude', latitude);
          setValue('longitude', longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
          toast.error('Location access denied. You can still search by city name.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setLocationPermission('not-supported');
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const fetchRooms = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const response = await propertiesAPI.getAvailableRooms(searchFilters);
      setRooms(response.data.rooms || []);
      
      if (response.data.search_center) {
        setSearchCenter(response.data.search_center);
        setSearchRadius(response.data.search_radius);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      toast.error('Failed to load available rooms');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    const searchFilters = {};
    if (data.location) searchFilters.location = data.location;
    if (data.minRent) searchFilters.minRent = data.minRent;
    if (data.maxRent) searchFilters.maxRent = data.maxRent;
    if (data.roomType) searchFilters.roomType = data.roomType;
    // include sort preferences
    if (sortBy) searchFilters.sortBy = sortBy;
    if (sortOrder) searchFilters.sortOrder = sortOrder;
    
    // Add location-based search if coordinates are available
    if (data.latitude && data.longitude) {
      searchFilters.latitude = data.latitude;
      searchFilters.longitude = data.longitude;
      searchFilters.radius = data.radius || 10;
    }
    
    setFilters(searchFilters);
    fetchRooms(searchFilters);
  };

  const searchNearby = () => {
    if (userLocation) {
      const searchFilters = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: searchRadius
      };
      if (sortBy) searchFilters.sortBy = sortBy;
      if (sortOrder) searchFilters.sortOrder = sortOrder;
      setFilters(searchFilters);
      fetchRooms(searchFilters);
    } else {
      toast.error('Location not available. Please enable location access.');
    }
  };

  const RoomCard = ({ room }) => (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col md:flex-row">
        {/* Room Image */}
        <div className="md:w-1/3">
          <div className="h-48 md:h-full bg-gray-200 rounded-lg flex items-center justify-center">
            {room.images && room.images.length > 0 ? (
              <img
                src={room.images[0]}
                alt={room.room_number}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Home className="h-12 w-12 text-gray-400" />
            )}
          </div>
        </div>

        {/* Room Details */}
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Room {room.room_number}
              </h3>
              <p className="text-gray-600">{room.room_type}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                ₹{room.rent_amount}
              </p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
          </div>

          {/* Property Info */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {room.properties.name}
            </h4>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {room.properties.address}, {room.properties.city}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">
                Owner: {room.properties.owners.name}
              </span>
            </div>
            
            {/* Distance Information */}
            {room.distance_km !== null && room.distance_km !== undefined && (
              <div className="flex items-center text-blue-600 mt-2">
                <Navigation className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  {room.distance_km.toFixed(1)} km away
                </span>
              </div>
            )}
          </div>

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Amenities:</p>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last updated: {new Date(room.last_updated).toLocaleDateString()}</span>
            </div>
            <button className="btn btn-primary" onClick={() => openBookingModal(room)}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Booking modal state and handlers
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [moveInDate, setMoveInDate] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  const openBookingModal = (room) => {
    console.debug('openBookingModal called for room', room?.id || room?.room_number);
    setBookingRoom(room);
    setMoveInDate('');
    setMoveOutDate('');
    setBookingNotes('');
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setBookingRoom(null);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!bookingRoom) return;
    if (!moveInDate) {
      toast.error('Please select a move-in date');
      return;
    }
    try {
      console.debug('submitBooking payload', { roomId: bookingRoom.id, moveInDate, moveOutDate, bookingNotes });
      // Basic client-side UUID validation
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
      if (!uuidRegex.test(String(bookingRoom.id))) {
        toast.error('Invalid room id format');
        console.error('Invalid room id:', bookingRoom.id);
        return;
      }
      setLoading(true);
      const payload = {
        roomId: bookingRoom.id,
        moveInDate: moveInDate
      };
      if (moveOutDate) payload.moveOutDate = moveOutDate;
      if (bookingNotes && bookingNotes.trim() !== '') payload.notes = bookingNotes.trim();

      const res = await bookingsAPI.bookRoom(payload);
      toast.success(res.data?.message || 'Booking request submitted');
      // refresh rooms to reflect reserved status
      fetchRooms(filters);
      closeBookingModal();
    } catch (err) {
      console.error('Booking failed:', err);
      console.debug('Booking error response data:', err?.response?.data);
      const serverData = err?.response?.data;
      if (serverData) {
        if (Array.isArray(serverData.errors) && serverData.errors.length > 0) {
          // express-validator style errors
          const msgs = serverData.errors.map(e => e.msg || `${e.param}: ${e.msg}`).join('\n');
          toast.error(msgs);
        } else if (serverData.error) {
          toast.error(serverData.error);
        } else {
          toast.error('Booking failed: ' + JSON.stringify(serverData));
        }
      } else {
        toast.error('Booking failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const animatedRoomCardProps = {
    initial: { opacity: 0, translateY: 30 },
    animate: { opacity: 1, translateY: 0 },
    exit: { opacity: 0, translateY: -30 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Available Rooms</h1>
        <p className="text-gray-600">Find your perfect room from available properties</p>
      </div>

      {/* Search Filters */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Location-based search section */}
          {userLocation && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Map className="h-5 w-5 text-blue-600" />
                  <h3 className="text-sm font-medium text-blue-900">Location-based Search</h3>
                </div>
                <button
                  type="button"
                  onClick={searchNearby}
                  className="btn btn-primary text-sm py-2 px-3"
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Search Nearby
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-blue-800 mb-1">
                    Search Radius (km)
                  </label>
                  <select
                    {...register('radius')}
                    onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                    className="input text-sm"
                  >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={15}>15 km</option>
                    <option value={25}>25 km</option>
                    <option value={50}>50 km</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-blue-700">
                    Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...register('location')}
                  type="text"
                  className="input pl-10"
                  placeholder="City or Area"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select {...register('roomType')} className="input">
                <option value="">All Types</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Quad">Quad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Rent (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...register('minRent')}
                  type="number"
                  className="input pl-10"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Rent (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...register('maxRent')}
                  type="number"
                  className="input pl-10"
                  placeholder="No limit"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
                <option value="rent">Rent</option>
                <option value="deposit">Deposit</option>
                <option value="created">Newest</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="input">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {locationPermission === 'denied' && (
                <button
                  type="button"
                  onClick={requestLocationPermission}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Enable Location Access
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search Rooms</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Available Rooms ({rooms.length})
            </h2>
            {searchCenter && (
              <p className="text-sm text-gray-600">
                Showing rooms within {searchRadius}km of your location
              </p>
            )}
          </div>
          {loading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <motion.div key={index} className="card animate-pulse"
                initial={{opacity:0,scale:0.95}}
                animate={{opacity:1,scale:1}}
                transition={{duration:0.4,delay:index*0.1}}
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <motion.div className="text-center py-12" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}>
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600">
              Try adjusting your search filters to find more rooms.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-6">
              {rooms.map((room) => (
                <motion.div key={room.id} {...animatedRoomCardProps}>
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && bookingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Book Room {bookingRoom.room_number}</h3>
            <form onSubmit={submitBooking} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Move-in Date</label>
                <input type="date" value={moveInDate} onChange={e => setMoveInDate(e.target.value)} required className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Move-out Date (optional)</label>
                <input type="date" value={moveOutDate} onChange={e => setMoveOutDate(e.target.value)} className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                <textarea value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} className="input w-full" rows={3}></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={closeBookingModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantSearch;
