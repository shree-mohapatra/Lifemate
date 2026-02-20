
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireAuth() {
  // Replace with your real auth check (context, zustand, redux, firebase, etc.)
  const isAuthenticated = !!localStorage.getItem('authToken'); // ← example only

  // or better: use your auth context
  // const { isLoggedIn } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}