import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"

export type QuizInProgress = {
  id: string
  title: string
  updated_at: string
}

type OpenQuizHandler = (quizId: string) => void;

export const getInProgressColumns = (
  onOpenQuizHandler: OpenQuizHandler
): ColumnDef<QuizInProgress>[] => {
  const columns: ColumnDef<QuizInProgress>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "updated_at",
      header: "Saved Date",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const inProgressQuiz = row.original
        return (
          <Button className="h-8" onClick={() => onOpenQuizHandler(inProgressQuiz.id)}>
            Open
          </Button>
        )
      },
    },
  ];
  return columns;
}