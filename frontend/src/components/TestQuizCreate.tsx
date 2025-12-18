import type { QuizMutateAnswerOptions, QuizMutateCorrectAnswers, QuizMutateQuestions, QuizWithQuestions } from "@/interfaces";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useCreateQuiz } from "@/hooks/useQuizzes";

const questions: QuizMutateQuestions = {
  create: [{
    id: "4555b382-b70e-43f2-9d76-368297736a30",
    text: "Which method is used to update state in a functional component?",
    type: "single",
    display_order: 0,
  }, {
    id: "777d0070-59a5-46dc-b4e0-358fccb004a1",
    text: "Which of the following are benefits of using React?",
    type: "multiple",
    display_order: 1,
  }],
  update: [],
  delete: [],
};
const answerOptions: QuizMutateAnswerOptions = {
  create: [{
    id: "cf284e4a-3760-4c90-8153-48761fd167b2",
    question_id: "4555b382-b70e-43f2-9d76-368297736a30",
    text: "this.setState()",
    display_order: 0,
  }, {
    id: "e8021c11-01b5-40ac-ae42-9ef1f3dc5bba",
    question_id: "4555b382-b70e-43f2-9d76-368297736a30",
    text: "useState hook's setter function",
    display_order: 1,
  }, {
    id: "af1bb349-ac6b-43da-8dea-cdc1c153b2e6",
    question_id: "4555b382-b70e-43f2-9d76-368297736a30",
    text: "forceUpdate()",
    display_order: 2,
  }, 
  
  
  {
    id: "fb1c070e-0bfe-466c-81ea-08c94d468bb0",
    question_id: "777d0070-59a5-46dc-b4e0-358fccb004a1",
    text: "Virtual DOM for performance",
    display_order: 0,
  }, {
    id: "9bc26fa9-44c4-48f2-848a-34f116051fa7",
    question_id: "777d0070-59a5-46dc-b4e0-358fccb004a1",
    text: "Server-side rendering only",
    display_order: 1,
  }, {
    id: "be0c7f9b-5548-4bec-b8e6-b28bec6ba780",
    question_id: "777d0070-59a5-46dc-b4e0-358fccb004a1",
    text: "Reusable components",
    display_order: 2,
  }, {
    id: "2ca60b85-920c-42ae-98dd-112d4fe1b63f",
    question_id: "777d0070-59a5-46dc-b4e0-358fccb004a1",
    text: "Direct manipulation of the real DOM",
    display_order: 3,
  }],
  update: [],
  delete: [],
};
const correctAnswers: QuizMutateCorrectAnswers = {
  create: [{
    question_id: "4555b382-b70e-43f2-9d76-368297736a30",
    answer_option_id: "e8021c11-01b5-40ac-ae42-9ef1f3dc5bba",
  }, 
  
  {
    question_id: "777d0070-59a5-46dc-b4e0-358fccb004a1",
    answer_option_id: "fb1c070e-0bfe-466c-81ea-08c94d468bb0",
  }, {
    question_id: "777d0070-59a5-46dc-b4e0-358fccb004a1",
    answer_option_id: "be0c7f9b-5548-4bec-b8e6-b28bec6ba780",
  }],
  delete: [],
}

export default function TestQuizCreate() {
  const createMutation = useCreateQuiz();

  const isLoadingCreateMutation = createMutation.isPending;
  
  const createQuizWithQuestionsOnSuccess = async () => {
    console.log("create quiz call successful");
  }
  
  const createQuizWithQuestions = async () => {
    const dataForCreate: QuizWithQuestions = {
      title: "Quiz by Bob with questions 1",
      isPublished: true,
      questions: questions,
      answerOptions: answerOptions,
      correctAnswers: correctAnswers,
    };
    
    createMutation.mutate(dataForCreate, {
      onSuccess: createQuizWithQuestionsOnSuccess,
    });
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
        <Button 
          variant="outline" 
          onClick={createQuizWithQuestions} 
          className="w-60"
        >
          {isLoadingCreateMutation ? "Loading" : "Test: Create quiz with questions"}
        </Button>
      </CardContent>
    </Card>
  )
}