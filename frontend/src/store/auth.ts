import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
};

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  fetchMe: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("http://localhost:5002/api/auth/me", {
        withCredentials: true, // include cookies
      });
      if (res.status === 200) {
        set({ user: res.data, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    await axios.post("http://localhost:5002/api/auth/logout", {}, {
      withCredentials: true,
    });
    set({ user: null });
  },
}));