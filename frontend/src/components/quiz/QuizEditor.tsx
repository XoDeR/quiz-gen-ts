import type { AnswerOption, OriginalQuizData, Question } from "@/interfaces";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type SaveResult =
  | { success: true; data: any }
  | { success: false; errors: string[] };

// Helper functions to normalize questions data from backend to format used in client
// Question format backend:
// {
//   id: "q-q7r8s9t0",
//   text: "Which of the following are benefits of using React?",
//   type: "multiple",
//   answerOptions: [
//     { id: "o-u1v2w3x4", text: "Virtual DOM for performance" },
//     { id: "o-y5z6a7b8", text: "Server-side rendering only" },
//     { id: "o-c9d0e1f2", text: "Reusable components" },
//     { id: "o-g3h4i5j6", text: "Direct manipulation of the real DOM" }
//   ],
//   correctAnswers: [
//     { id: "ca-p9o8i7", answerOptionId: "o-u1v2w3x4" },
//     { id: "ca-d6e5f4", answerOptionId: "o-c9d0e1f2" }
//   ]
// }
// Question format frontend:
// {
//   id: "q-q7r8s9t0",
//   text: "Which of the following are benefits of using React?",
//   type: "multiple",
//   answerOptions: [
//     { id: "o-u1v2w3x4", text: "Virtual DOM for performance", isCorrect: true, correctAnswerId: "ca-p9o8i7" },
//     { id: "o-y5z6a7b8", text: "Server-side rendering only", isCorrect: false, correctAnswerId: null },
//     { id: "o-c9d0e1f2", text: "Reusable components", isCorrect: true, correctAnswerId: "o-c9d0e1f2" },
//     { id: "o-g3h4i5j6", text: "Direct manipulation of the real DOM", isCorrect: false, correctAnswerId: null }
//   ],
// }
const normalizeQuestions = (originalData: OriginalQuizData): Question[] => {
  return originalData.questions.map(question => {
    // For quick lookup of correct answer id's
    const correctAnswersMap = new Map(question.correctAnswers.map(correctAnswer => [correctAnswer.answerOptionId, correctAnswer.id]));

    const answerOptions: AnswerOption[] = question.answerOptions.map(answerOption => ({
      id: answerOption.id,
      text: answerOption.text,
      isCorrect: correctAnswersMap.has(answerOption.id),
      correctAnswerId: correctAnswersMap.get(answerOption.id) || null,
    }));

    return {
      id: question.id,
      text: question.text,
      type: question.type,
      answerOptions,
    };
  });
};

const QuizEditor = ({
  originalQuizEditorState,
  discardEventId,
  saveEventId,
  onSaveResult,
}: {
  originalQuizEditorState: OriginalQuizData
  discardEventId: number;
  saveEventId: number;
  onSaveResult: (result: SaveResult) => void;
}) => {

  const [quizEditorState, setQuizEditorState] = useState({ field: "" });

  useEffect(() => {
    if (discardEventId > 0) {
      // reset to initial
      setQuizEditorState({ field: "" });
    }
  }, [discardEventId]);

  useEffect(() => {
    if (saveEventId > 0) {
      /*
      if (!quizEditorState.field) {
        onSaveResult({ success: false, errors: ["Field cannot be empty"] });
      } else {
        onSaveResult({ success: true, data: quizEditorState });
      }
      */
      // send data to parent
      onSaveResult({ success: true, data: quizEditorState });
    }
  }, [saveEventId]);

  // Internal Quiz Editor state

  // Original state is saved to calc the diff and be able to discard
  const [originalTitle] = useState(originalQuizEditorState.title);
  const [originalQuestions] = useState<Question[]>(() =>
    normalizeQuestions(originalQuizEditorState)
  );

  // Editable state
  const [quizTitle, setQuizTitle] = useState(originalTitle);
  const [questions, setQuestions] = useState<Question[]>(originalQuestions);

  return (
    <div>
      {/* Title Input */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <Label className="mb-2 block">Quiz Title</Label>
        <Input
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Quiz title"
          className="text-lg font-medium"
        />
      </div>
      QuizEditor
    </div>

  )
};

export default QuizEditor;