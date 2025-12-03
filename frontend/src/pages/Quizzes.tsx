import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default function Quizzes() {
  // tanstack query example usage
  const { data, isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const res = await fetch("/api/quizzes");
      return res.json();
    },
  });

  return (
    <>
      <h1>Quizzes</h1>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
      {/* tanstack query example usage */}
      {isLoading ? <p>Loading...</p> : <ul>{data.map((q: { id: string; title: string; }) => <li key={q.id}>{q.title}</li>)}</ul>};
    </>
  );
}