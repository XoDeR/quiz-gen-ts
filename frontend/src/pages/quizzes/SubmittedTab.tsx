import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { columns, type SubmittedQuiz } from "./SubmittedColumns"
import { DataTable } from "./SubmittedDataTable"

function getData(): SubmittedQuiz[] {
  // Fetch data from your API here.
  return [
    {
      id: "1", // id of quiz
      title: "Quiz 1", // name of quiz
      date: new Date().toString(), // updated_at of submission
      result: "12/20", // result of submission
    },
    {
      id: "2",
      title: "Quiz 2",
      date: new Date().toString(),
      result: "12/20",
    },
    {
      id: "3",
      title: "Quiz 3",
      date: new Date().toString(),
      result: "12/20",
    },
    {
      id: "4",
      title: "Quiz 4",
      date: new Date().toString(),
      result: "12/20",
    },
  ];
}

export default function SubmittedTab() {
  const data = getData()

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
      <CardFooter>

      </CardFooter>
    </Card>
  );
}