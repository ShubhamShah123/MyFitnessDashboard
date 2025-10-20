// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [cookies] = useCookies(['key']);

  // If no cookie, redirect to login
  if (!cookies.key) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
