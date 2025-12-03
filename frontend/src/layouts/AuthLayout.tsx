import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <h1>Auth Area</h1>
      {/* Shared for login/register */}
      <Outlet />
    </div>
  );
}