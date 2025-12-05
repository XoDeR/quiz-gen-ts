import QuizEditor from "@/components/quiz/QuizEditor";
import type { OriginalQuizData } from "@/interfaces";

const MOCK_ORIGINAL_QUIZ_DATA: OriginalQuizData = {
  title: "",
  isPublished: false,
  questions: [
  ]
};

export default function QuizCreate() {
  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <QuizEditor />
      </div>
    </div>
  );
}