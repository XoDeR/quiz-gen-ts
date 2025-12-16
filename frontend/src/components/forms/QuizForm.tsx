import React from 'react';
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


interface AnswerOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  type: "single" | "multiple";
  answerOptions: AnswerOption[];
}

type QuizFormValues = Record<string, string | string[]>;

const mockQuizData: Question[] = [
  {
    id: "q-a1b2c3d4",
    text: "Which method is used to update state in a functional component?",
    type: "single",
    answerOptions: [
      { id: "o-e5f6g7h8", text: "###this.setState()" },
      { id: "o-i9j0k1l2", text: "useState hook's setter function" },
      { id: "o-m3n4o5p6", text: "forceUpdate()" }
    ],
  },
  {
    id: "q-q7r8s9t0",
    text: "Which of the following are benefits of using React?",
    type: "multiple",
    answerOptions: [
      { id: "o-u1v2w3x4", text: "###Virtual DOM for performance" },
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
  question: Question;
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
  question: Question;
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
  
  
  // single choice is '', multiple is []
  const initialValues: QuizFormValues = mockQuizData.reduce((acc, q) => {
    acc[q.id] = q.type === 'single' ? '' : [];
    return acc;
  }, {} as QuizFormValues);

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      console.log("Form Submitted:", value);
      alert('Quiz Submitted! Check console for data.');
    },
  });

  if (isLoading) return <div>Loading quiz...</div>;
  if (isError) return <div>Error loading quiz: {error.message}</div>;

  return (
    <div className="mx-auto max-w-4xl p-8 bg-white shadow-lg rounded-lg">
      <div>
      <h2>{quiz.title}</h2>
      <p>ID: {quiz.id}</p>
      <p>Published: {quiz.isPublished ? 'Yes' : 'No'}</p>
    </div>
      
      <h1 className="text-3xl font-bold mb-6">Test quiz form</h1>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-8"
      >
        {mockQuizData.map((question) => (
          <FieldGroup key={question.id}>
            <form.Field
              name={question.id as keyof QuizFormValues}
              validators={{
                  onChange: ({ value }) => {
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
          </FieldGroup>
        ))}

        <Button type="submit" className="w-full">
          Submit Quiz
        </Button>
      </form>
    </div>
  );
};

export default QuizForm;