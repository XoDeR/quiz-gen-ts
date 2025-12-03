import { Outlet, Navigate } from "react-router";

// TODO replace with real auth check
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default function ProtectedLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="protected-layout">
      <h1>Protected Area</h1>
      {/* Shared for protected pages */}
      <Outlet />
    </div>
  );
}