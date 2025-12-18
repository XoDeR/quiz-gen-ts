import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCreateQuiz, useQuizzes, useQuizzesTest } from "@/hooks/useQuizzes";

import { useNavigate } from 'react-router';

import { getQuizzesToSolveColumns, type QuizToSolve } from "./QuizzesColumns"
import { DataTable } from "./QuizzesDataTable";
import { Button } from "@/components/ui/button";
import type { QuizMutateAnswerOptions, QuizMutateCorrectAnswers, QuizMutateQuestions, QuizWithQuestions } from "@/interfaces";

function getData(): QuizToSolve[] {
  return [
    {
      id: "1", // id of quiz
      title: "Quiz 1", // name of quiz
      updated_at: new Date().toLocaleString(), // updated_at of quiz
    },
    {
      id: "2",
      title: "Quiz 2",
      updated_at: new Date().toLocaleString(),
    },
    {
      id: "3",
      title: "Quiz 3",
      updated_at: new Date().toLocaleString(),
    },
    {
      id: "4",
      title: "Quiz 4",
      updated_at: new Date().toLocaleString(),
    },
  ];
}

export default function QuizzesTab() {
  const navigate = useNavigate();

  const createMutation = useCreateQuiz();

  // get all quizzes that are: published (published === true) and created by other users (byOthers === true)
  const { data: quizzes, isLoading } = useQuizzes(true, true);
  console.log("quizzes: ", quizzes);

  const mockData = getData();

  const handleOpenQuiz = (quizId: string) => {
    console.log(`Opening quiz with ID: ${quizId}`);

    const status = "to-do";
    const path = `/quizzes/${quizId}/view?status=${status}`;
    navigate(path);
  }
  
  const columns = getQuizzesToSolveColumns(handleOpenQuiz);

  // test
  const { data: quizzesAll, refetch: refetchAll}  = useQuizzesTest();
  const { data: quizzesWithParams, refetch: refetchWithParams}  = useQuizzesTest(true, true);

  const getQuizzesPublishedByOthers = async () => {
    refetchWithParams();
  }

  const getQuizzes = async () => {
    refetchAll();
  }
  //-- test

  // test
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
  //-- test



  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes</CardTitle>
        <CardDescription>
          Try to solve these quizzes
        </CardDescription>
      </CardHeader>
      {/* test */}
      <Button variant="outline" onClick={createQuizWithQuestions} className="w-60">Test: Create quiz with questions</Button>
      {/* test */}
      {/* test */}
      {/* <Button variant="outline" onClick={getQuizzesPublishedByOthers} className="w-40">Test: Get published quizzes by others</Button>
      <Button variant="outline" onClick={getQuizzes} className="w-40">Test: Get quizzes (all)</Button>
      <p>All quizzes</p>
      {quizzesAll && <pre>{JSON.stringify(quizzesAll, null, 2)}</pre>}
      <p>Quizzes to solve</p>
      {quizzesWithParams && <pre>{JSON.stringify(quizzesWithParams, null, 2)}</pre>} */}
      {/* test */}

      <CardContent className="grid gap-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          // quizzes.map(quiz => <div key={quiz.id}>{quiz.title}</div>)
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={quizzes} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}