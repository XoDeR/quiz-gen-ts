import { useState } from "react"

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

  }

  const login = async () => {
    // route: http://localhost:5002/api/auth/login
  }

  const me = async () => {
    // route: http://localhost:5002/api/auth/me
  }

  const refresh = async () => {
    // route: http://localhost:5002/api/auth/refresh
  }

  const logout = async () => {
    // route: http://localhost:5002/api/auth/logout
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
          <div className="border border-blue-400 border-2">
            {res}
          </div>
        </div>
      </div>
    </div>
  );
}