import { useState } from "react"
import axios from "axios";

export default function Login() {
  /*
  - User info (id, username, email) of currently logged in user is kept
    in zustand store
  - access token is saved in http cookie
  - register save user pw
  - login sets the access and refresh cookies
  - when app starts and after every login
    info from /api/auth/me is saved in zustand store
  - protected API is handled by access cookie
  - if a call fails with "Access token expired", 
    - call /api/auth/refresh. The browser sends the refresh cookie automatically
    - replace the user info with a new, received from /api/auth/me
    - retry the original request
  - on logout, call /api/auth/logout and clear user in zustand store
    logout should reset access and refresh cookies
  */

  const [res, setRes] = useState("Response from server");

  const register = async () => {
    // route: http://localhost:5002/api/auth/register
    try {
      const response = await axios.post("http://localhost:5002/api/auth/register", {
        username: "demoUser",
        email: "demo@example.com",
        password: "secret123",
      });
      setRes(response.data.message);
    } catch (err: any) {
      setRes(err.response?.data?.message || "Register failed");
    }

  }

  const login = async () => {
    // route: http://localhost:5002/api/auth/login
    try {
      const response = await axios.post("http://localhost:5002/api/auth/login", {
        email: "demo@example.com",
        password: "secret123",
      });
      setRes(response.data.message);
    } catch (err: any) {
      setRes(err.response?.data?.message || "Login failed");
    }
  }

  const me = async () => {
    // route: http://localhost:5002/api/auth/me
    try {
      const response = await axios.get("http://localhost:5002/api/auth/me", {
        withCredentials: true, // include cookies
      });
      setRes(response.data.message || JSON.stringify(response.data));
    } catch (err: any) {
      setRes(err.response?.data?.message || "Me failed");
    }
  }

  const refresh = async () => {
    // route: http://localhost:5002/api/auth/refresh
    try {
      const response = await axios.post("http://localhost:5002/api/auth/refresh", {}, {
        withCredentials: true,
      });
      setRes(response.data.message);
    } catch (err: any) {
      setRes(err.response?.data?.message || "Refresh failed");
    }
  }

  const logout = async () => {
    // route: http://localhost:5002/api/auth/logout
    try {
      const response = await axios.post("http://localhost:5002/api/auth/logout", {}, {
        withCredentials: true,
      });
      setRes(response.data.message);
    } catch (err: any) {
      setRes(err.response?.data?.message || "Logout failed");
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <div className="flex justify-start pl-10">
        <div className="flex flex-col">
          <button onClick={register} className="border rounded-sm p-2">Register</button>
          <button onClick={login} className="border rounded-sm p-2">Login</button>
          <button onClick={me} className="border rounded-sm p-2">Me</button>
          <button onClick={refresh} className="border rounded-sm p-2">Refresh</button>
          <button onClick={logout} className="border rounded-sm p-2">Logout</button>
          <div className="border-blue-400 border-2">
            {res}
          </div>
        </div>
      </div>
    </div>
  );
}