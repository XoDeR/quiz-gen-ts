import { Outlet, Navigate } from "react-router";

// TODO replace with real auth check
const isAuthenticated = () => {
  // TODO temp
  // return !!localStorage.getItem("token");
  return true;
};

export default function ProtectedLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="protected-layout">
      <div className="w-full h-16 bg-gray-300">
        <h1>Protected Area</h1>
      </div>

      {/* Shared for protected pages */}
      <Outlet />
    </div>
  );
}