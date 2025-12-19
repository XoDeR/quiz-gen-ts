import { Button } from "@/components/ui/button"
import type { QuizCreatedByUser } from "@/interfaces";
import type { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from 'lucide-react';

type MutateQuizHandler = (quizId: string) => void;
type QueryQuizHandler = (quizId: string) => void;

export const getCreatedQuizzesColumns = (
  onViewQuizHandler: QueryQuizHandler,
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
          <div className="flex align-center">
            <Button className="h-8 m-0.5" onClick={() => onViewQuizHandler(quizCreatedByUser.id)}>
              View
            </Button>
            <Button className="h-8 m-0.5" onClick={() => onEditQuizHandler(quizCreatedByUser.id)}>
              Edit
            </Button>
            <Button className="h-8 m-0.5" onClick={() => onDeleteQuizHandler(quizCreatedByUser.id)}>
              <Trash2 className="w-8 h-8"/>
            </Button>
          </div>
        )
      },
    },
  ];
  return columns;
}