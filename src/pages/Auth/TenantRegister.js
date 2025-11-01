import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const TenantRegister = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Tenant may send simple JSON (no files)
      const result = await registerUser(data, 'tenant');
      if (result.success) {
        toast.success('Registration successful! Please wait for admin approval.');
        navigate('/auth/login');
      }
    } catch (error) {
      console.error('Tenant registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-lg rounded-lg max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tenant Registration</h2>
        <p className="text-gray-600 mt-2">Create your TenantFlow tenant account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input {...register('name', { required: 'Name is required' })} className="input" />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input type="email" {...register('email', { required: 'Email is required' })} className="input" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" {...register('phone')} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Number (Optional)</label>
          <input type="text" {...register('roomNumber')} className="input" placeholder="Enter room number if assigned" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <input type="password" {...register('password', { required: 'Password is required', minLength: 6 })} className="input" />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full btn btn-primary py-3 text-base font-medium">
          {loading ? 'Creating account...' : 'Create Tenant Account'}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">Already have an account? <Link to="/auth/login" className="text-blue-600">Sign In</Link></p>
        </div>
      </form>
    </div>
  );
};

export default TenantRegister;
