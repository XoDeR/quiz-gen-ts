import { useMutation, useQueryClient } from "@tanstack/react-query";
import {api} from "../api/api";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: any) => api.public.post("/login", credentials),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: any) => api.public.post("/register", userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
  });
};