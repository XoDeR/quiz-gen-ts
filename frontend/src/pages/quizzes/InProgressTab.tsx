import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router';

import { getInProgressColumns } from "./InProgressColumns"
import { DataTable } from "./InProgressDataTable";
import { useUserSubmissions } from "@/hooks/useSubmissions";

export default function InProgressTab() {
  const navigate = useNavigate();

  const { data: quizSubmissions, isLoading } = useUserSubmissions(false);

  const handleOpenQuiz = (quizId: string) => {
    console.log(`Opening quiz with ID: ${quizId}`);

    const status = "in-progress";
    const path = `/quizzes/${quizId}/view?status=${status}`;
    navigate(path);
  }

  const columns = getInProgressColumns(handleOpenQuiz);

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