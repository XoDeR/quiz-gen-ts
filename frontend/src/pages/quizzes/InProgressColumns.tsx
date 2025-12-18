import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"

export type QuizInProgress = {
  quizId: string;
  quizIsPublished: boolean;
  quizTitle: string;
  submissionCompleted: boolean;
  submissionId: string;
  submissionResult: string | null;
  submissionUpdatedAt: Date;
  submissionUserId: string;
}

type OpenQuizHandler = (quizId: string) => void;

export const getInProgressColumns = (
  onOpenQuizHandler: OpenQuizHandler
): ColumnDef<QuizInProgress>[] => {
  const columns: ColumnDef<QuizInProgress>[] = [
    {
      accessorKey: "quizTitle",
      header: "Title",
    },
    {
      accessorKey: "submissionUpdatedAt",
      header: "Saved Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("submissionUpdatedAt"));
        const formatted = date.toLocaleString();
        return <div className="">{formatted}</div>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const inProgressQuiz = row.original
        return (
          <Button className="h-8" onClick={() => onOpenQuizHandler(inProgressQuiz.quizId)}>
            Open
          </Button>
        )
      },
    },
  ];
  return columns;
}