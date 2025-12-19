import QuizEditor from "@/components/quiz/QuizEditor";
import { Button } from "@/components/ui/button";
import type { OriginalCorrectAnswer, OriginalQuestion, OriginalQuizData, QuizResponseOutput } from "@/interfaces";
import { BookOpenCheck, Save } from "lucide-react";
import { useState } from "react";
import { useQuiz, useUpdateQuiz } from "@/hooks/useQuizzes";
import { useParams } from "react-router";

const MOCK_ORIGINAL_QUIZ_DATA: OriginalQuizData = {
  title: "React Basics",
  isPublished: false,
  questions: [
    {
      id: "q-a1b2c3d4",
      text: "Which method is used to update state in a functional component?",
      type: "single",
      answerOptions: [
        { id: "o-e5f6g7h8", text: "this.setState()" },
        { id: "o-i9j0k1l2", text: "useState hook's setter function" },
        { id: "o-m3n4o5p6", text: "forceUpdate()" }
      ],
      correctAnswers: [
        { id: "ca-x1y2z3", answerOptionId: "o-i9j0k1l2" }
      ]
    },
    {
      id: "q-q7r8s9t0",
      text: "Which of the following are benefits of using React?",
      type: "multiple",
      answerOptions: [
        { id: "o-u1v2w3x4", text: "Virtual DOM for performance" },
        { id: "o-y5z6a7b8", text: "Server-side rendering only" },
        { id: "o-c9d0e1f2", text: "Reusable components" },
        { id: "o-g3h4i5j6", text: "Direct manipulation of the real DOM" }
      ],
      correctAnswers: [
        { id: "ca-p9o8i7", answerOptionId: "o-u1v2w3x4" },
        { id: "ca-d6e5f4", answerOptionId: "o-c9d0e1f2" }
      ]
    }
  ]
};

export default function QuizEdit() {
  const { quizId } = useParams<{ quizId: string }>();

  if (!quizId) {
    throw new Error("Quiz id is missing from the URL");
  }

  console.log("quizId: ", quizId);

  const [discardEventId, setDiscardEventId] = useState(0);
  const [saveEventId, setSaveEventId] = useState(0);
  const [saveAndPublishEventId, setSaveAndPublishEventId] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const { data: quizResponseOutput, isLoading, isError, error } = useQuiz(quizId, true);
  const mutation = useUpdateQuiz();

  const handleDiscardClicked = () => {
    setDiscardEventId((prev) => prev + 1);
  }

  const handleSaveClicked = () => {
    setSaveEventId((prev) => prev + 1);
  }

  const handleSaveAndPublishClicked = () => {
    setSaveAndPublishEventId((prev) => prev + 1);
  }

  const handleSaveResult = (result: { success: boolean; data?: any; errors?: string[] }) => {
    if (result.success) {
      console.log("Data sent to backend: ", result.data);
      mutation.mutate({...result.data, id: quizId}, {
        onSuccess: () => setErrors([]),
        onError: (err: any) => setErrors([err.message]),
      });
    } else {
      setErrors(result.errors ?? []);
    }
  };

  const handleSaveAndPublishResult = (result: { success: boolean; data?: any; errors?: string[] }) => {
    if (result.success) {
      console.log("Data sent to backend: ", result.data);
      mutation.mutate({...result.data, id: quizId}, {
        onSuccess: () => setErrors([]),
        onError: (err: any) => setErrors([err.message]),
      });
    } else {
      setErrors(result.errors ?? []);
    }
  };

  function mapQuizResponseOutputToOriginalQuizData(data: QuizResponseOutput): OriginalQuizData {
    if (!data) {
      throw new Error("Data is missing");
    }
    if (!data.title) {
      throw new Error("Data 'title' is missing");
    }
    if (!data.questions) {
      throw new Error("Data 'questions' is missing");
    }

    const originalQuestionList: OriginalQuestion[] = [];
    for (const questionOutput of data.questions) {
      const originalAnswerOptionList: { id: string; text: string }[] = [];
      for (const answerOption of questionOutput.answerOptions) {
        originalAnswerOptionList.push({ id: answerOption.id, text: answerOption.text });
      }
      if (!questionOutput.correctAnswers) {
        throw new Error("Data 'questions/correctAnswers' is missing");
      }
      const originalCorrectAnswerList: OriginalCorrectAnswer[] = [];
      for (const correctAnswer of questionOutput.correctAnswers) {
        const originalCorrectAnswer: OriginalCorrectAnswer = {
          id: correctAnswer.id,
          answerOptionId: correctAnswer.answerOptionId,
        };
        originalCorrectAnswerList.push(originalCorrectAnswer);
      }
      
      const originalQuestion: OriginalQuestion = {
        id: questionOutput.id,
        text: questionOutput.text,
        type: questionOutput.type,
        answerOptions: originalAnswerOptionList,
        correctAnswers: originalCorrectAnswerList,
      }
      originalQuestionList.push(originalQuestion);
    }
    return {
      title: data.title,
      isPublished: data.isPublished,
      questions: originalQuestionList,
    }
  }

  if (isLoading) return <div>Loading quiz...</div>;
  if (isError) return <div>Error loading quiz: {error.message}</div>;
  if (!quizResponseOutput || !quizResponseOutput.questions) return <div>Quiz data not found or empty.</div>;

  console.log("quiz: ", quizResponseOutput);

  
    
    

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Edit Quiz</h1>
          <p className="text-zinc-500">Edit questions, reorder items, and mark correct answers.</p>
        </div>

        <QuizEditor
          //originalQuizEditorState={MOCK_ORIGINAL_QUIZ_DATA}
          originalQuizEditorState={originalQuizData}
          discardEventId={discardEventId}
          saveEventId={saveEventId}
          saveAndPublishEventId={saveAndPublishEventId}
          onSaveResult={handleSaveResult}
          onSaveAndPublishResult={handleSaveAndPublishResult}
        />

        {/* Actions buttons */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-zinc-200 p-4 -mx-4 sm:-mx-6 lg:-mx-8 mt-10 flex items-center justify-between z-10">
          {errors.length > 0 && (
            <div className="text-sm text-red-500 font-medium px-4">
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 px-4">
            <Button variant="destructive" onClick={handleDiscardClicked}>Discard Changes</Button>
            <Button onClick={handleSaveClicked} className="gap-2 px-6">
              <Save size={16} /> Save Changes
            </Button>
            <Button onClick={handleSaveAndPublishClicked} className="gap-2 px-6">
              <BookOpenCheck size={16} /> Save &amp; Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}