import {api} from "@/api/api";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router";

export default function Login() {
  const { user, fetchMe, logout } = useAuthStore();
  const navigate = useNavigate();

  const login = async () => {
    // route: http://localhost:5002/api/auth/login
    try {
      const response = await api.public.post("/auth/login", {
        email: "demo@example.com",
        password: "secret123",
      }, { withCredentials: true }); // withCredentials: true is needed because after login cookies are set by the server
      console.log(response.data.message);

      // me should be always called after login
      await fetchMe();

      const path = `/`;
      navigate(path);
    } catch (err: any) {
      console.log(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={login} className="border rounded-sm p-2">Test Login</button>
    </div>
  );
}