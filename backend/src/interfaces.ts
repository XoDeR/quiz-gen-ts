export interface QuizMutateQuestions {
  create: { text: string, type: 'single' | 'multiple', display_order: number }[];
  update: { id: string, text?: string, type?: 'single' | 'multiple', display_order?: number }[];
  delete: string[];
};

export interface QuizMutateAnswerOptions {

}

export interface QuizMutateCorrectAnswers {
  create: { question_id: string }[];
  delete: string[]; // list of correctAnswer id's
}