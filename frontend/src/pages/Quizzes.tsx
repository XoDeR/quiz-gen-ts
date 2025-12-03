import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import QuizzesTab from "./quizzes/QuizzesTab";
import SubmittedTab from "./quizzes/SubmittedTab";
import InProgressTab from "./quizzes/InProgressTab";

export default function Quizzes() {
  // tanstack query example usage
  const { data, isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const res = await fetch("/api/quizzes");
      return res.json();
    },
  });

  // tabs:
  // quizzes Quizzes
  // inProgress In Progress
  // submitted Submitted

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="quizzes">
        <TabsList className="h-12">
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
        </TabsList>
        <TabsContent value="quizzes">
          <QuizzesTab />
        </TabsContent>
        <TabsContent value="inProgress">
          <InProgressTab />
        </TabsContent>
        <TabsContent value="submitted">
          <SubmittedTab />
        </TabsContent>
      </Tabs>
      <>
        <h1>Quizzes</h1>
        <div className="flex min-h-svh flex-col items-center justify-center">
          <Button>Click me</Button>
        </div>
        {/* tanstack query example usage */}
        {/* {isLoading ? <p>Loading...</p> : <ul>{data.map((q: { id: string; title: string; }) => <li key={q.id}>{q.title}</li>)}</ul>}; */}
      </>

    </div >

  );
}