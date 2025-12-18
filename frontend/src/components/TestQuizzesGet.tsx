import { useQuizzesTest } from "@/hooks/useQuizzes";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function TestQuizzesGet() {
  const { data: quizzesAll, refetch: refetchAll}  = useQuizzesTest();
  const { data: quizzesWithParams, refetch: refetchWithParams}  = useQuizzesTest(true, true);

  const getQuizzesPublishedByOthers = async () => {
    refetchWithParams();
  }

  const getQuizzes = async () => {
    refetchAll();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes</CardTitle>
        <CardDescription>
          Test quiz create
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Button variant="outline" onClick={getQuizzesPublishedByOthers} className="w-40">Test: Get published quizzes by others</Button>
        <Button variant="outline" onClick={getQuizzes} className="w-40">Test: Get quizzes (all)</Button>
        <p>All quizzes</p>
        {quizzesAll && <pre>{JSON.stringify(quizzesAll, null, 2)}</pre>}
        <p>Quizzes to solve</p>
        {quizzesWithParams && <pre>{JSON.stringify(quizzesWithParams, null, 2)}</pre>}
      </CardContent>
    </Card>
  )
}