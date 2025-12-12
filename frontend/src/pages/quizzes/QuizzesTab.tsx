import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuizzes } from "@/hooks/useQuizzes";

export default function QuizzesTab() {

  const { data: quizzes, isLoading } = useQuizzes();

  console.log("quizzes: ", quizzes);

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
        {isLoading ? (<p>Loading...</p>) : (quizzes.map(quiz => <div key={quiz.id}>{quiz.name}</div>))}
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  );
}