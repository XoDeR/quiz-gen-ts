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