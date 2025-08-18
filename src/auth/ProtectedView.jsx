import React from 'react';
import { useAuth } from '@/auth/useAuth';

const ProtectedView = ({ children, fallback }) => {
  const { user } = useAuth();
  
  if (!user) {
    return fallback;
  }
  
  return children;
};

export default ProtectedView;