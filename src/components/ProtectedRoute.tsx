import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Redirects to /login when user is not authenticated.
 * Shows nothing while auth is loading.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-4">
        <p className="text-navy font-bold">Loading…</p>
      </div>
    );
  }

  if (!user) {
    const returnTo = location.pathname + location.search;
    return <Navigate to={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login'} replace />;
  }

  return <>{children}</>;
}
