import { createFileRoute } from "@tanstack/react-router";
import { QuizView } from "@/components/dashboard/SimplePages";

export const Route = createFileRoute("/dashboard/quizzes")({
  component: QuizView,
});
