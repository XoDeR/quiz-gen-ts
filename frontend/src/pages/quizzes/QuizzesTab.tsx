import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuizzes, useQuizzesTest } from "@/hooks/useQuizzes";

import { useNavigate } from 'react-router';

import { getQuizzesToSolveColumns, type QuizToSolve } from "./QuizzesColumns"
import { DataTable } from "./QuizzesDataTable";
import { Button } from "@/components/ui/button";

function getData(): QuizToSolve[] {
  // Fetch data from your API here.
  return [
    {
      id: "1", // id of quiz
      title: "Quiz 1", // name of quiz
      date: new Date().toLocaleString(), // updated_at of quiz
    },
    {
      id: "2",
      title: "Quiz 2",
      date: new Date().toLocaleString(),
    },
    {
      id: "3",
      title: "Quiz 3",
      date: new Date().toLocaleString(),
    },
    {
      id: "4",
      title: "Quiz 4",
      date: new Date().toLocaleString(),
    },
  ];
}

export default function QuizzesTab() {
  const navigate = useNavigate();

  // get all quizzes that are: published (published === true) and created by other users (byOthers === true)
  const { data: quizzes, isLoading } = useQuizzes(true, true);
  console.log("quizzes: ", quizzes);

  const mockData = getData();

  const handleOpenQuiz = (quizId: string) => {
    console.log(`Opening quiz with ID: ${quizId}`);

    const status = "to-do";
    const path = `/quizzes/${quizId}/view?status=${status}`;
    navigate(path);
  }
  
  const columns = getQuizzesToSolveColumns(handleOpenQuiz);

  // test
  const { data: quizzesAll, refetch: refetchAll}  = useQuizzesTest();
  const { data: quizzesWithParams, refetch: refetchWithParams}  = useQuizzesTest(true, true);

  const getQuizzesPublishedByOthers = async () => {
    refetchWithParams();
  }

  const getQuizzes = async () => {
    refetchAll();
  }
  //-- test

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes</CardTitle>
        <CardDescription>
          Try to solve these quizzes
        </CardDescription>
      </CardHeader>
      {/* test */}
      {/* <Button variant="outline" onClick={getQuizzesPublishedByOthers} className="w-40">Test: Get published quizzes by others</Button>
      <Button variant="outline" onClick={getQuizzes} className="w-40">Test: Get quizzes (all)</Button>
      <p>All quizzes</p>
      {quizzesAll && <pre>{JSON.stringify(quizzesAll, null, 2)}</pre>}
      <p>Quizzes to solve</p>
      {quizzesWithParams && <pre>{JSON.stringify(quizzesWithParams, null, 2)}</pre>} */}
      {/* test */}

      <CardContent className="grid gap-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          // quizzes.map(quiz => <div key={quiz.id}>{quiz.title}</div>)
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={quizzes} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}