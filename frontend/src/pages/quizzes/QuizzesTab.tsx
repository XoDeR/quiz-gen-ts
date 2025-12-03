import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function QuizzesTab() {
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
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  );
}