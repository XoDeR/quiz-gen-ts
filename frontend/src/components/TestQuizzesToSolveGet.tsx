import type { QuizToSolve } from "@/pages/quizzes/QuizzesColumns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

function getData(): QuizToSolve[] {
  return [
    {
      id: "1", // id of quiz
      title: "Quiz 1", // name of quiz
      updated_at: new Date().toLocaleString(), // updated_at of quiz
    },
    {
      id: "2",
      title: "Quiz 2",
      updated_at: new Date().toLocaleString(),
    },
    {
      id: "3",
      title: "Quiz 3",
      updated_at: new Date().toLocaleString(),
    },
    {
      id: "4",
      title: "Quiz 4",
      updated_at: new Date().toLocaleString(),
    },
  ];
}

export default function TestQuizzesToSolve() {
  const mockData = getData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes</CardTitle>
        <CardDescription>
          Test quiz create
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {mockData.map(quiz => <div key={quiz.id}>{quiz.title}</div>)}
      </CardContent>
    </Card>
  )
}