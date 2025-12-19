import { useQuizzesTest } from "@/hooks/useQuizzes";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

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

export default function TestQuizzesGet() {
  const { data: quizzesAll, refetch: refetchAll}  = useQuizzesTest();
  const { data: quizzesWithParams, refetch: refetchWithParams}  = useQuizzesTest(true, true);

  const getQuizzesPublishedByOthers = async () => {
    refetchWithParams();
  }

  const getQuizzes = async () => {
    refetchAll();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes</CardTitle>
        <CardDescription>
          Test quiz create
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Button variant="outline" onClick={getQuizzesPublishedByOthers} className="w-40">Test: Get published quizzes by others</Button>
        <Button variant="outline" onClick={getQuizzes} className="w-40">Test: Get quizzes (all)</Button>
        <p>All quizzes</p>
        {quizzesAll && <pre>{JSON.stringify(quizzesAll, null, 2)}</pre>}
        <p>Quizzes to solve</p>
        {quizzesWithParams && <pre>{JSON.stringify(quizzesWithParams, null, 2)}</pre>}
      </CardContent>
    </Card>
  )
}