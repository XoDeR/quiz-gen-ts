import QuizEditor from "@/components/quiz/QuizEditor";
import type { OriginalQuizData } from "@/interfaces";

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
  <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
    <div className="max-w-4xl mx-auto space-y-8">
      <QuizEditor />
    </div>
  </div>
}