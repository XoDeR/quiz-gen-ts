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