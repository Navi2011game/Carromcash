// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useStore();
  if (loading) return <div className="min-h-screen bg-[#1F0F2A] flex items-center justify-center text-pink-500">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

// AdminRoute.jsx
export const AdminRoute = ({ children }) => {
  const { user, userData, loading } = useStore();
  if (loading) return <div className="min-h-screen bg-[#1F0F2A] flex items-center justify-center text-pink-500">Loading...</div>;
  return user && userData?.isAdmin ? children : <Navigate to="/dashboard" replace />;
};
