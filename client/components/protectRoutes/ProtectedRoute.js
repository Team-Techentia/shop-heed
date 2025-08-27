import React from 'react';
import useAuth from './useAuth';

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const isAuthenticated = useAuth();

    if (!isAuthenticated) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };
};

export default ProtectedRoute;
