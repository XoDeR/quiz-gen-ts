import React, { useEffect, useState } from 'react';
import { useForm } from "@tanstack/react-form";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQuiz } from '@/hooks/useQuizzes';
import type { QuestionViewTodo } from '@/interfaces';
import { useCreateSubmission } from '@/hooks/useSubmissions';

type QuizFormValues = Record<string, string | string[]>;

const mockQuizData: QuestionViewTodo[] = [
  {
    id: "q-a1b2c3d4",
    text: "Which method is used to update state in a functional component?",
    type: "single",
    answerOptions: [
      { id: "o-e5f6g7h8", text: "this.setState()" },
      { id: "o-i9j0k1l2", text: "useState hook's setter function" },
      { id: "o-m3n4o5p6", text: "forceUpdate()" }
    ],
  },
  {
    id: "q-q7r8s9t0",
    text: "Which of the following are benefits of using React?",
    type: "multiple",
    answerOptions: [
      { id: "o-u1v2w3x4", text: "Virtual DOM for performance" },
      { id: "o-y5z6a7b8", text: "Server-side rendering only" },
      { id: "o-c9d0e1f2", text: "Reusable components" },
      { id: "o-g3h4i5j6", text: "Direct manipulation of the real DOM" }
    ],
  }
];

type FieldProp = {
    name: string;
    state: {
        value: string | string[];
        meta: { isTouched: boolean; isValid: boolean; errors: string[] | undefined };
    };
    handleChange: (value: string | string[]) => void;
    handleBlur: () => void;
};

interface SingleChoiceFieldProps {
  question: QuestionViewTodo;
  field: FieldProp; // simplified type
}

const SingleChoiceField: React.FC<SingleChoiceFieldProps> = ({ question, field }) => {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{question.text}</FieldLabel>
      <RadioGroup
        name={field.name}
        value={field.state.value as string}
        onValueChange={(val) => {
          field.handleChange(val);
          field.handleBlur();
        }}
        onBlur={field.handleBlur}
        className="grid gap-2"
        aria-invalid={isInvalid}
      >
        {question.answerOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id}>{option.text}</Label>
          </div>
        ))}
      </RadioGroup>
      <FieldDescription>Select only one answer.</FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors?.map(message => ({ message }))} />}
    </Field>
  );
};

interface MultipleChoiceFieldProps {
  question: QuestionViewTodo;
  field: FieldProp; // simplified type
}

const MultipleChoiceField: React.FC<MultipleChoiceFieldProps> = ({ question, field }) => {
  const selectedOptions = (field.state.value || []) as string[];
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    let newSelection = checked
      ? [...selectedOptions, optionId]
      : selectedOptions.filter((id) => id !== optionId);
      
    field.handleChange(newSelection);
    field.handleBlur();
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{question.text}</FieldLabel>
      <div className="grid gap-2" aria-invalid={isInvalid} onBlur={field.handleBlur}>
        {question.answerOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={(checked) => handleCheckboxChange(option.id, !!checked)}
              name={field.name}
            />
            <Label htmlFor={option.id}>{option.text}</Label>
          </div>
        ))}
      </div>
      <FieldDescription>Select all applicable answers.</FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors?.map(message => ({ message }))} />}
    </Field>
  );
};

interface Props {
  quizId: string;
};

const QuizForm = ({ quizId }: Props) => {
  const { data: quiz, isLoading, isError, error } = useQuiz(quizId);
  const createMutation = useCreateSubmission();
  const [formErrorMessage, setFormErrorMessage] = useState("");
  
  const createSubmissionOnSuccess = async () => {
    console.log("Quiz submitted successfully");
  }

  const saveForLaterOnSuccess = async () => {
    console.log("Quiz saved successfully");
  }

  const form = useForm({
    defaultValues: {},
    onSubmit: async ({ value }) => {
      /*
      // format:
      value: {
        question_id: answer_option_id // for single question type
        question_id: [answer_option_id, answer_option_id] // for multiple question type
      }
      */
      if (!quiz || !quiz.questions) {
        setFormErrorMessage("Nothing to submit. No quiz questions.");
        return;
      }

      // validate all fields entered manually
      const allQuestionsAnswered = quiz.questions.every((q) => {
        const answer = (value as QuizFormValues)[q.id as keyof QuizFormValues];
        if (q.type === 'multiple') return Array.isArray(answer) && answer.length > 0;
        return !!answer;
      });

      if (!allQuestionsAnswered) {
        setFormErrorMessage("Please answer all questions before submitting.");
        return;
      }

      const dataForCreate = {
        quizId: quizId,
        completed: true,
        attemptedAnswersData: value,
      };

      createMutation.mutate(dataForCreate, {
        onSuccess: createSubmissionOnSuccess,
      });
    },
  });

  const {reset} = form;

  useEffect(() => {
    if (quiz?.questions) {
      const newInitialValues: QuizFormValues = quiz.questions.reduce((acc, q) => {
          acc[q.id] = q.type === 'single' ? '' : []; 
          return acc;
      }, {} as QuizFormValues);

      reset(newInitialValues);
    }
  }, [quiz, reset]);

  if (isLoading) return <div>Loading quiz...</div>;
  if (isError) return <div>Error loading quiz: {error.message}</div>;
  if (!quiz || !quiz.questions) return <div>Quiz data not found or empty.</div>;

  const handleSaveForLater = async () => {
    // validate fields that have values
    await form.validate('change');

    const hasErrors = form.state.fieldMeta && 
      Object.values(form.state.fieldMeta).some((meta) => meta?.errors?.length && meta?.errors?.length > 0);

    if (hasErrors) {
      const message = "Some answers are invalid. Please fix them before saving.";
      console.error(message);
      setFormErrorMessage(message);
      return;
    }

    // remove empty values
    const currentValues = form.state.values;
    const filteredAnswers = Object.fromEntries(
      Object.entries(currentValues).filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined && value !== '';
      })
    );

    if (Object.entries(filteredAnswers).length === 0) {
      setFormErrorMessage("There is nothing to save.");
    }

    const dataForSave = {
      quizId: quizId,
      completed: false,
      attemptedAnswersData: filteredAnswers,
    };

    createMutation.mutate(dataForSave, {
      onSuccess: saveForLaterOnSuccess,
    });
  }
  
  return (
    <div className="mx-auto max-w-4xl p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-8"
      >
        <FieldGroup >
          {quiz.questions.map((question) => (
            <form.Field
              key={question.id}
              name={question.id as keyof QuizFormValues}
              validators={{
                onChange: ({ value }) => {
                  if (formErrorMessage) {
                    setFormErrorMessage("");
                  }
                  // if the field is empty
                  // it's valid for "Save for later"
                  if (!value || (Array.isArray(value) && value.length === 0)) {
                    return undefined; 
                  }
                    
                  if (question.type === 'single' && !value) {
                    return 'Please select an option.';
                  }
                  if (question.type === 'multiple' && (value as string[]).length === 0) {
                    return 'Please select at least one option.';
                  }
                  return undefined;
                },
              }}
              children={(field) => (
                <>
                  {question.type === 'single' ? (
                    <SingleChoiceField question={question} field={field as unknown as FieldProp} />
                  ) : (
                    <MultipleChoiceField question={question} field={field as unknown as FieldProp} />
                  )}
                </>
              )}
            />
          ))}
        </FieldGroup>
        
        {formErrorMessage && (
          <div className='p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg'>
            { formErrorMessage }
          </div>
        )}

        <div className="flex justify-between">
          <Button type="submit" className="">
            Submit Quiz
          </Button>
          <Button type="button" variant="default" className="" onClick={handleSaveForLater}>
            Save for later
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;