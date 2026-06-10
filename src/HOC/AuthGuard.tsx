import React from 'react';
import { UserAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = UserAuth();
  const { pathname } = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ prevPath: pathname }} />;
  }

  return children;
}
