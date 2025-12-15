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
import axios from "axios";
import { api } from "@/api/api";

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

  const createTestQuizzes = async () => {
    await api.protected.post('/quizzes', { title: "Quiz 1", isPublished: true});
    await api.protected.post('/quizzes', { title: "Quiz 2", isPublished: true});
    await api.protected.post('/quizzes', { title: "Quiz 3", isPublished: true});
  }

  const createTestQuizzes2 = async () => {
    await api.protected.post('/quizzes', { title: "Quiz By Bob 1", isPublished: true});
    await api.protected.post('/quizzes', { title: "Quiz By Bob 2", isPublished: true});
    await api.protected.post('/quizzes', { title: "Quiz By Bob 3", isPublished: true});
  }

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
        <Button variant="outline" onClick={createTestQuizzes} className="w-40">Create test quizzes</Button>
        <Button variant="outline" onClick={createTestQuizzes2} className="w-40">Create test quizzes 2</Button>
        {/* tanstack query example usage */}
        {/* {isLoading ? <p>Loading...</p> : <ul>{data.map((q: { id: string; title: string; }) => <li key={q.id}>{q.title}</li>)}</ul>}; */}
      </>

    </div >

  );
}