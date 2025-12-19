import { Button } from "@/components/ui/button"
import type { QuizCreatedByUser } from "@/interfaces";
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from 'lucide-react';

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
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ row }) => {
        const published = row.getValue("isPublished");
        if (published) {
          return <div className="text-gray-600">Published</div>
        } else {
          return <div className=""></div>
        }
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const quizCreatedByUser = row.original
        return (
          <div className="flex align-center">
            {quizCreatedByUser.isPublished &&
              <Button className="h-8 m-0.5" onClick={() => onViewQuizHandler(quizCreatedByUser.id)}>
                <Eye className="w-8 h-8"/> View
              </Button>
            }
            {!quizCreatedByUser.isPublished &&
              <Button className="h-8 m-0.5" onClick={() => onEditQuizHandler(quizCreatedByUser.id)}>
                <Pencil className="w-8 h-8"/> Edit
              </Button>
            }
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