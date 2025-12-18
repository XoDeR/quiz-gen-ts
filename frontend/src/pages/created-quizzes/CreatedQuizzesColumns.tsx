import { Button } from "@/components/ui/button"
import type { QuizCreatedByUser } from "@/interfaces";
import type { ColumnDef } from "@tanstack/react-table"

type MutateQuizHandler = (quizId: string) => void;

export const getCreatedQuizzesColumns = (
  onEditQuizHandler: MutateQuizHandler,
  onDeleteQuizHandler: MutateQuizHandler
): ColumnDef<QuizCreatedByUser>[] => {
  const columns: ColumnDef<QuizCreatedByUser>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "updatedAt",
      header: "Date Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        const formatted = date.toLocaleString();
        return <div className="">{formatted}</div>
      },
    },
    {
      accessorKey: "participantCount",
      header: "Number of participants",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const quizCreatedByUser = row.original
        return (
          <div>
            <Button className="h-8" onClick={() => onEditQuizHandler(quizCreatedByUser.id)}>
              Open
            </Button>
            <Button className="h-8" onClick={() => onDeleteQuizHandler(quizCreatedByUser.id)}>
              Delete
            </Button>
          </div>
        )
      },
    },
  ];
  return columns;
}