import React from 'react';
import { Outlet } from 'react-router-dom';
import AnimatedOutlet from './AnimatedOutlet';
import BackgroundAnimation from './BackgroundAnimation';

const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <BackgroundAnimation />
      <div className="max-w-md w-full space-y-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TenantFlow</h1>
          <p className="text-gray-600">PG/Hostel Management System</p>
        </div>
        <AnimatedOutlet />
      </div>
    </div>
  );
};

export default AuthLayout;
