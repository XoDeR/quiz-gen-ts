import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {api} from "../api/api";

interface Quiz {
  id: string;
  title: string;
  isPublished: boolean;
};

// Get all quizzes created by all users (with isPublished === true)
export function useQuizzes() {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await api.protected.get('/quizzes');
      if (res.status !== 200) throw new Error('Failed to fetch quizzes');
      return res.data;
    },
  });
}

// Get quizzes created by the current user
export function useUserQuizzes() {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await api.protected.get('/quizzes/me');
      if (res.status !== 200) throw new Error('Failed to fetch quizzes');
      return res.data;
    },
  });
}

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newQuiz: Partial<Quiz>) =>
      api.protected.post("/quizzes", newQuiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};