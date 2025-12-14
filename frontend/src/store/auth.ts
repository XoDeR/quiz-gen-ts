import { create } from "zustand";
import axios from "axios";
import { api } from "@/api/api";

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
  loading: true, // should always start with loading true

  setUser: (user) => set({ user }),

  fetchMe: async () => {
    set({ loading: true });
    try {
      console.log("[Store] calling /auth/me");
      const res = await api.protected.get("/auth/me");
      console.log("[Store] /auth/me response:", res.status);
      if (res.status === 200) {
        set({ user: res.data, loading: false });
      } else {
        set({ user: null, loading: false });
      }
      //debugger;
    } catch(err) {
      console.log("[Store] /auth/me failed:", err);
      set({ user: null, loading: false });
      //debugger;
    }
  },

  logout: async () => {
    await api.protected.post("/auth/logout", {}, {
      withCredentials: true,
    });
    set({ user: null });
  },
}));