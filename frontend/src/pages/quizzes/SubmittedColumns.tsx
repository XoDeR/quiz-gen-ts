import type { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SubmittedQuiz = {
  id: string
  title: string
  date: string
  result: string
}

export const columns: ColumnDef<SubmittedQuiz>[] = [
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
]