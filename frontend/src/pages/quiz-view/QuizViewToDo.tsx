// queries:
//  useQuiz params: none
// mutations: 
//    useCreateSubmission with completed true | false

import QuizForm from "@/components/forms/QuizForm";
import { useQuiz } from "@/hooks/useQuizzes";
import { useCreateSubmission } from "@/hooks/useSubmissions";
import { useState } from "react";


interface Props {
  quizId: string;
};

const QuizViewToDo = ({ quizId }: Props) => {
  const { data: quiz, isLoading, isError, error } = useQuiz(quizId);
  const createMutation = useCreateSubmission();

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmitQuizResult = (result: { success: boolean; data?: any; errors?: string[] }) => {
    if (result.success) {
      createMutation.mutate({...result.data, quizId: quizId}, {
        onSuccess: createSubmissionOnSuccess,
      });
    } else {
      setErrors(result.errors ?? []);
    }
  }

  const handleSaveForLaterResult = (result: { success: boolean; data?: any; errors?: string[] }) => {
    if (result.success) {
      createMutation.mutate({...result.data, quizId: quizId}, {
        onSuccess: saveForLaterOnSuccess,
      });
    } else {
      setErrors(result.errors ?? []);
    }
  }

  const createSubmissionOnSuccess = async () => {
    console.log("Quiz submitted successfully");
  }

  const saveForLaterOnSuccess = async () => {
    console.log("Quiz saved successfully");
  }

  if (isLoading) return <div>Loading quiz...</div>;
  if (isError) return <div>Error loading quiz: {error.message}</div>;
  if (!quiz || !quiz.questions) return <div>Quiz data not found or empty.</div>;

  return (
    <div className="mx-auto max-w-4xl p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      <QuizForm 
        quizData={quiz} 
        onSubmitQuizResult={handleSubmitQuizResult}
        onSaveForLaterResult={handleSaveForLaterResult}
      />
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-zinc-200 p-4 -mx-4 sm:-mx-6 lg:-mx-8 mt-10 flex items-center justify-between z-10">
        {errors.length > 0 && (
          <div className="text-sm text-red-500 font-medium px-4">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizViewToDo;