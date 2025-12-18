import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getSubmittedColumns, type SubmittedQuiz } from "./SubmittedColumns"
import { DataTable } from "./SubmittedDataTable"

import { useNavigate } from 'react-router';

// data needed:
// query getSubmissionWithQuizByUserId(userId)
// returns:
// [{ quiz.id, quiz.title, submission.updated_at, submission.result }, {}]



function getData(): SubmittedQuiz[] {
  // Fetch data from your API here.
  return [
    {
      id: "1", // id of quiz
      title: "Quiz 1", // name of quiz
      date: new Date().toLocaleString(), // updated_at of submission
      result: "12/20", // result of submission
    },
    {
      id: "2",
      title: "Quiz 2",
      date: new Date().toLocaleString(),
      result: "12/20",
    },
    {
      id: "3",
      title: "Quiz 3",
      date: new Date().toLocaleString(),
      result: "12/20",
    },
    {
      id: "4",
      title: "Quiz 4",
      date: new Date().toLocaleString(),
      result: "12/20",
    },
  ];
}

export default function SubmittedTab() {
  const navigate = useNavigate();

  const data = getData();

  const handleOpenQuiz = (quizId: string) => {
    console.log(`Opening quiz with ID: ${quizId}`);

    const status = "submitted";
    const path = `/quizzes/${quizId}/view?status=${status}`;
    navigate(path);
  }

  const columns = getSubmittedColumns(handleOpenQuiz);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submitted</CardTitle>
        <CardDescription>
          Review submitted quizzes
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </CardContent>
    </Card>
  );
}