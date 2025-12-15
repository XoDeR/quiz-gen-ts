import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {api} from "../api/api";

interface Quiz {
  id: string;
  title: string;
  isPublished: boolean;
};

// Get all quizzes created by all users
export function useQuizzes(published?: boolean, byOthers?: boolean) {
  return useQuery({
    queryKey: ['quizzes', { published, byOthers }],
    queryFn: async () => {
      const res = await api.protected.get('/quizzes', {
        params: {
          published,
          byOthers,
        }
      });
      if (res.status !== 200) throw new Error('Failed to fetch quizzes');
      return res.data;
    },
  });
}

export function useQuizzesTest(published?: boolean, byOthers?: boolean) {
  return useQuery({
    queryKey: ['quizzes', { published, byOthers }],
    queryFn: async () => {
      const res = await api.protected.get('/quizzes', {
        params: {
          published,
          byOthers,
        }
      });
      if (res.status !== 200) throw new Error('Failed to fetch quizzes');
      return res.data;
    },
    enabled: false, // query does not run by default -- needed for testing
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