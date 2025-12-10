import axios from "axios";

export default function Login() {
  const login = async () => {
    // route: http://localhost:5002/api/auth/login
    try {
      const response = await axios.post("http://localhost:5002/api/auth/login", {
        email: "demo@example.com",
        password: "secret123",
      }, { withCredentials: true }); // withCredentials: true is needed because after login cookies are set by the server
      console.log(response.data.message);
    } catch (err: any) {
      console.log(err.response?.data?.message || "Login failed");
    }

    // me should be always called after login

    // route: http://localhost:5002/api/auth/me
    try {
      const response = await axios.get("http://localhost:5002/api/auth/me", {
        withCredentials: true, // include cookies
      });
      console.log(response.data.message || JSON.stringify(response.data));
    } catch (err: any) {
      console.log(err.response?.data?.message || "Me failed");
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={login} className="border rounded-sm p-2">Login</button>
    </div>
  );
}