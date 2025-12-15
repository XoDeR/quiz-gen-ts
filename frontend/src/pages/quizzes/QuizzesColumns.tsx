import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type QuizToSolve = {
  id: string
  title: string
  updated_at: string
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
      accessorKey: "updated_at",
      header: "Date Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updated_at"));
        const formatted = date.toLocaleString();
        return <div className="">{formatted}</div>
      },
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