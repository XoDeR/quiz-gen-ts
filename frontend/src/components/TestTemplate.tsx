import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function TestTemplate() {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes</CardTitle>
        <CardDescription>
          Test quiz create
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">

      </CardContent>
    </Card>
  )
}