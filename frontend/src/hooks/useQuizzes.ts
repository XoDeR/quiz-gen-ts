import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useQuizzes() {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5002/api/quizzes', { withCredentials: true });
      if (res.status !== 200) throw new Error('Failed to fetch quizzes');
      return res.data;
    }
  });
}