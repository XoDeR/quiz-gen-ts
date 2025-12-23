export interface OriginalCorrectAnswer {
  id: string;
  answerOptionId: string;
}

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  correctAnswerId: string | null;
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  answerOptions: AnswerOption[];
}

export interface OriginalQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  answerOptions: { id: string; text: string }[];
  correctAnswers: OriginalCorrectAnswer[];
}

export interface OriginalQuizData {
  title: string;
  isPublished: boolean;
  questions: OriginalQuestion[];
}

export interface QuizMutateQuestions {
  create: { id: string, text: string, type: 'single' | 'multiple', display_order: number }[];
  update: { id: string, text?: string, type?: 'single' | 'multiple', display_order?: number }[];
  delete: string[];
};

export interface QuizMutateAnswerOptions {
  create: { id: string, question_id: string, text: string, display_order: number }[];
  update: { id: string, text?: string, display_order?: number }[];
  delete: string[];
}

export interface QuizMutateCorrectAnswers {
  create: { question_id: string, answer_option_id: string }[];
  delete: string[];
}

export interface Quiz {
  id: string;
  title: string;
  isPublished: boolean;
};

export interface QuizCreatedByUser {
  id: string;
  title: string;
  isPublished: boolean;
  updatedAt: Date;
  participantCount: number;
};

export interface QuizDiff {
  quiz: { 
    title?: string;
    isPublished?: boolean; 
  };
  questions: {
    create: { id: string, text: string, type: 'single' | 'multiple', display_order: number }[];
    update: { id: string, text?: string, type?: 'single' | 'multiple', display_order?: number }[];
    delete: string[];
  };
  answerOptions: {
    create: { id: string, question_id: string, text: string, display_order: number }[];
    update: { id: string, text?: string, display_order?: number }[];
    delete: string[];
  };
  correctAnswers: {
    create: { question_id: string, answer_option_id: string }[];
    delete: string[];
  };
}

export interface QuizWithQuestions extends Partial<Quiz> {
  questions?: QuizMutateQuestions;
  answerOptions?: QuizMutateAnswerOptions;
  correctAnswers?: QuizMutateCorrectAnswers;
}

export interface AnswerOptionViewTodo {
  id: string;
  text: string;
}

export interface QuestionViewTodo {
  id: string;
  text: string;
  type: "single" | "multiple";
  answerOptions: AnswerOptionViewTodo[];
}

export interface QuestionOutput {
  id: string;
  text: string;
  type: "single" | "multiple";
  answerOptions: {
      id: string;
      text: string;
      displayOrder: number;
  }[];
  correctAnswers?: {
      id: string;
      answerOptionId: string;
  }[];
}

export interface SubmissionOutput {
  id: string;
  result?: string;
  completed: boolean;
  attemptedAnswers: {
    id: string;
    questionId: string;
    answerOptionId: string;
  }[];
}

export interface QuizResponseOutput {
  id: string;
    title: string;
    isPublished: boolean;
    updatedAt: Date;
    questions?: QuestionOutput[];
    submission?: SubmissionOutput;
}