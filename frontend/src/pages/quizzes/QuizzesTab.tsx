import { useQuizzes } from "@/api/quizzes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function QuizzesTab() {

  const { data: quizzes, isLoading } = useQuizzes();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes</CardTitle>
        <CardDescription>
          Try to solve these quizzes
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        Content
        {quizzes.map(quiz => <div key={quiz.id}>{quiz.name}</div>)}
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  );
}