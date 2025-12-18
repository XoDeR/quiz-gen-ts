import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router';

import { getInProgressColumns, type QuizInProgress } from "./InProgressColumns"
import { DataTable } from "./InProgressDataTable";


function getData(): QuizInProgress[] {
  return [
    {
      id: "1", // id of quiz
      title: "Quiz 1", // title of quiz
      updated_at: new Date().toLocaleString(), // updated_at of submission
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

export default function InProgressTab() {
  const navigate = useNavigate();

  // get user's submissions with status completed === false
  // TO BE IMPLEMENTED
  // const { data: quizzes, isLoading } = useUserSubmissions(false);
  const isLoading = false;

  const handleOpenQuiz = (quizId: string) => {
    console.log(`Opening quiz with ID: ${quizId}`);

    const status = "in-progress";
    const path = `/quizzes/${quizId}/view?status=${status}`;
    navigate(path);
  }

  const columns = getInProgressColumns(handleOpenQuiz);

  // TO CHANGE
  const mockData = getData();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes In Progress</CardTitle>
        <CardDescription>
          Continue with your saved quizzes
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          // quizzes.map(quiz => <div key={quiz.id}>{quiz.title}</div>)
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={mockData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}