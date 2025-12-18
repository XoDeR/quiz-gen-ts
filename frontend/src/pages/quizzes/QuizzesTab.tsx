import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuizzes } from "@/hooks/useQuizzes";

import { useNavigate } from 'react-router';

import { getQuizzesToSolveColumns } from "./QuizzesColumns"
import { DataTable } from "./QuizzesDataTable";

export default function QuizzesTab() {
  const navigate = useNavigate();

  // get all quizzes that are: published (published === true) and created by other users (byOthers === true)
  const { data: quizzes, isLoading } = useQuizzes(true, true);

  const handleOpenQuiz = (quizId: string) => {
    console.log(`Opening quiz with ID: ${quizId}`);

    const status = "to-do";
    const path = `/quizzes/${quizId}/view?status=${status}`;
    navigate(path);
  }
  
  const columns = getQuizzesToSolveColumns(handleOpenQuiz);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes</CardTitle>
        <CardDescription>
          Try to solve these quizzes
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={quizzes} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}