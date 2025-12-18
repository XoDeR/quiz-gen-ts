import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router';

import { getInProgressColumns, type QuizInProgress } from "./InProgressColumns"
import { DataTable } from "./InProgressDataTable";
import { useUserSubmissions } from "@/hooks/useSubmissions";


function getData(): Partial<QuizInProgress>[] {
  return [
    {
      quizId: "1", // id of quiz
      quizTitle: "Quiz 1", // title of quiz
      submissionUpdatedAt: new Date(), // updated_at of submission
    },
    {
      quizId: "2",
      quizTitle: "Quiz 2",
      submissionUpdatedAt: new Date(),
    },
    {
      quizId: "3",
      quizTitle: "Quiz 3",
      submissionUpdatedAt: new Date(),
    },
    {
      quizId: "4",
      quizTitle: "Quiz 4",
      submissionUpdatedAt: new Date(),
    },
  ];
}

export default function InProgressTab() {
  const navigate = useNavigate();

  // get user's submissions with status completed === false
  // TO BE IMPLEMENTED
  // const { data: quizzes, isLoading } = useUserSubmissions(false);
  const { data: quizSubmissions, isLoading } = useUserSubmissions(false);

  console.log("quizSubmissions: ", quizSubmissions);

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
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={quizSubmissions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}