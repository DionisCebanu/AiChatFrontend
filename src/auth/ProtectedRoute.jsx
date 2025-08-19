import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center" style={{backgroundColor: 'var(--bg-primary)'}}>
        {/* You can add a nice spinner here */}
        <p style={{color: 'var(--text-primary)'}}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;