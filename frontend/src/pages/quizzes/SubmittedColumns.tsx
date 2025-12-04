import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SubmittedQuiz = {
  id: string
  title: string
  date: string
  result: string
}

type OpenQuizHandler = (quizId: string) => void;

export const getSubmittedColumns = (
  onOpenQuizHandler: OpenQuizHandler
): ColumnDef<SubmittedQuiz>[] => {
  const columns: ColumnDef<SubmittedQuiz>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "date",
      header: "Submitted Date",
    },
    {
      accessorKey: "result",
      header: "Result",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const submittedQuiz = row.original
        return (
          <Button className="h-8" onClick={() => onOpenQuizHandler(submittedQuiz.id)}>
            Open
          </Button>
        )
      },
    },
  ];
  return columns;
}