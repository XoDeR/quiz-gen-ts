import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router';

import { getCreatedQuizzesColumns } from "./created-quizzes/CreatedQuizzesColumns"
import { DataTable } from "./created-quizzes/CreatedQuizzesDataTable";
import { useDeleteQuiz, useUserQuizzes } from "@/hooks/useQuizzes";

export default function CreatedQuizzes() {
  const navigate = useNavigate();

  const { data: quizzesCreatedByUser, isLoading } = useUserQuizzes();
  const deleteQuizMutation = useDeleteQuiz();

  const handleEditQuiz = (quizId: string) => {
    console.log(`Editing quiz with ID: ${quizId}`);

    const path = `/quizzes/${quizId}/edit`;
    navigate(path);
  }

  const handleDeleteQuiz = (quizId: string) => {
    console.log(`Deleting quiz with ID: ${quizId}`);
    deleteQuizMutation.mutate(quizId);
  }

  const columns = getCreatedQuizzesColumns(handleEditQuiz, handleDeleteQuiz);
  
  return (
  <Card>
    <CardHeader>
      <CardTitle>Created Quizzes</CardTitle>
      <CardDescription>
        Create/Edit your own quiz
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-6">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={quizzesCreatedByUser} />
        </div>
      )}
    </CardContent>
  </Card>
  );
}