import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
      return <div className="p-4 text-center">Betöltés...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <div className="p-4 text-center">Betöltés...</div>;
    }

    return user && isAdmin() ? <Outlet /> : <Navigate to="/" replace />;
}
