import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type QuizToSolve = {
  id: string
  title: string
  date: string
}

type OpenQuizHandler = (quizId: string) => void;

export const getQuizzesToSolveColumns = (
  onOpenQuizHandler: OpenQuizHandler
): ColumnDef<QuizToSolve>[] => {
  const columns: ColumnDef<QuizToSolve>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "date",
      header: "Created Date",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const quizToSolve = row.original
        return (
          <Button className="h-8" onClick={() => onOpenQuizHandler(quizToSolve.id)}>
            Open
          </Button>
        )
      },
    },
  ];
  return columns;
}