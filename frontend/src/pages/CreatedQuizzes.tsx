import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router';

import { getCreatedQuizzesColumns } from "./created-quizzes/CreatedQuizzesColumns"
import { DataTable } from "./created-quizzes/CreatedQuizzesDataTable";
import { useDeleteQuiz, useUserQuizzes } from "@/hooks/useQuizzes";
import { Button } from "@/components/ui/button";

export default function CreatedQuizzes() {
  const navigate = useNavigate();

  const { data: quizzesCreatedByUser, isLoading } = useUserQuizzes();
  const deleteQuizMutation = useDeleteQuiz();

  const handleCreateQuiz = () => {
    const path = `/quizzes/create`;
    navigate(path);
  }

  const handleViewQuiz = (quizId: string) => {
    console.log(`Viewing quiz with ID: ${quizId}`);
    // TODO this should have a param byAuthor
    // View should show questions with correct answers
    // but without options to modify content
    const path = `/quizzes/${quizId}/view`;
    navigate(path);
  }

  const handleEditQuiz = (quizId: string) => {
    console.log(`Editing quiz with ID: ${quizId}`);

    const path = `/quizzes/${quizId}/edit`;
    navigate(path);
  }

  const handleDeleteQuiz = (quizId: string) => {
    const confirmed = window.confirm("Are you sure you want to discard changes?");
    if (confirmed) {
      console.log(`Deleting quiz with ID: ${quizId}`);
      deleteQuizMutation.mutate(quizId);
    }
  }

  const columns = getCreatedQuizzesColumns(handleViewQuiz, handleEditQuiz, handleDeleteQuiz);
  
  return (
  <Card>
    <CardHeader>
      <CardTitle>Created Quizzes</CardTitle>
      <CardDescription>
        Create/Edit your own quiz
      </CardDescription>
        <div className="container mx-auto flex justify-end">
          <Button variant="default" className="text-2xl p-8" onClick={handleCreateQuiz}>Create</Button>
        </div>
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