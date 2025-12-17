import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {api} from "../api/api";

interface SubmissionWithAttemptedAnswers {

}

// Get submissions created by the current user
export function useUserSubmissions() {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      const res = await api.protected.get('/submissions/me');
      if (res.status !== 200) throw new Error('Failed to fetch submissions');
      return res.data;
    },
  });
}

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newSubmission: SubmissionWithAttemptedAnswers) =>
      api.protected.post("/submissions", newSubmission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
};