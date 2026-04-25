import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export type Quiz = {
  id: string;
  question: string;
  options: string[];
  photoUrl?: string;
  points: number;
  category: string;
};

export function useQuizzes() {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      return apiRequest("/quizzes") as Promise<Quiz[]>;
    },
  });
}

export function useSubmitQuizAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ quizId, answer }: { quizId: string; answer: string }) => {
      return apiRequest(`/quizzes/${quizId}/answer`, {
        method: "POST",
        body: JSON.stringify({ answer }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
}
