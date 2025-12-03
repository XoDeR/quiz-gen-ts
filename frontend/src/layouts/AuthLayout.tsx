import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="w-full h-16 bg-gray-300">
        <h1>Auth Area</h1>
      </div>
      {/* Shared for login/register */}
      <Outlet />
    </div>
  );
}