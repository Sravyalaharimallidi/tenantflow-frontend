import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Lock, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('tenant');
  const [loading, setLoading] = useState(false);
  const [hasBookedRoom, setHasBookedRoom] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // For tenant login, include the hasBookedRoom flag
      const loginData = userType === 'tenant' ? { ...data, hasBookedRoom } : data;
      const result = await login(loginData, userType);
      if (result.success) {
        // Navigate based on user role
        const redirectPath = result.user.role === 'owner' ? '/owner/dashboard' :
                           result.user.role === 'tenant' ? '/tenant/dashboard' :
                           '/admin/dashboard';
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isTenantLogin = userType === 'tenant';
  const roomNumber = watch('roomNumber');

  return (
    <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        <p className="text-gray-600 mt-2">Access your TenantFlow account</p>
      </div>

      

      {/* User Type Selection */}
      <div className="mb-6">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setUserType('tenant')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              userType === 'tenant'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Tenant
          </button>
          <button
            type="button"
            onClick={() => setUserType('owner')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              userType === 'owner'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="h-4 w-4 inline mr-2" />
            Owner
          </button>
          <button
            type="button"
            onClick={() => setUserType('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              userType === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="h-4 w-4 inline mr-2" />
            Admin
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="input"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Tenant Login Options */}
        {isTenantLogin && (
          <>
            {/* Checkbox for room booking status */}
            <div className="flex items-center space-x-2">
              <input
                id="hasBookedRoom"
                type="checkbox"
                checked={hasBookedRoom}
                onChange={(e) => setHasBookedRoom(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasBookedRoom" className="text-sm font-medium text-gray-700">
                I have already booked a room
              </label>
            </div>

            {/* Room Number (only if hasBookedRoom is true) */}
            {hasBookedRoom && (
              <div>
                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number
                </label>
                <input
                  id="roomNumber"
                  type="text"
                  {...register('roomNumber', {
                    required: hasBookedRoom ? 'Room number is required' : false
                  })}
                  className="input"
                  placeholder="Enter your room number"
                />
                {errors.roomNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.roomNumber.message}</p>
                )}
              </div>
            )}

            {/* Password (only if hasBookedRoom is false) */}
            {!hasBookedRoom && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: !hasBookedRoom ? 'Password is required' : false,
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="input pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            )}
          </>
        )}

        {/* Password (for owners and admins) */}
        {!isTenantLogin && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="input pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary py-3 text-base font-medium"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Registration Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/register/owner" className="text-blue-600 hover:text-blue-800 font-medium">Register as Owner</Link>
          </p>
          <p className="text-sm text-gray-600">
            <Link to="/auth/register/tenant" className="text-blue-600 hover:text-blue-800 font-medium">Register as Tenant</Link>
          </p>
          <p className="text-sm text-gray-600">
            <Link to="/auth/register/admin" className="text-blue-600 hover:text-blue-800 font-medium">Register as Admin</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
