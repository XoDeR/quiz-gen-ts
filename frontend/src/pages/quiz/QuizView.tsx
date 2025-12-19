import QuizForm from '@/components/forms/QuizForm';
import { useParams, useSearchParams } from 'react-router';

export default function QuizView() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();

  const quizStatus = searchParams.get('status') || "no-status";

  let quizStatusMessage = '';
  switch (quizStatus) {
    case 'submitted':
      quizStatusMessage = 'This quiz has been submitted.';
      break;
    case 'in-progress':
      quizStatusMessage = 'This quiz is currently in progress.';
      break;
    case 'to-do':
      quizStatusMessage = 'Start solving this quiz';
      break;
    default:
      quizStatusMessage = 'Default quiz view.';
  }

  if (quizStatus === 'to-do') {

  }

  // show new quiz with no given answers
  // this is a form -- possible to edit
  const isToDoQuiz = quizStatus === "to-do"; 
  // show partially filled quiz, partially filled data is taken from
  // a corresponding submission with status competed === false
  // this is a form -- possible to edit
  const isInProgressQuiz = quizStatus === "in-progress";
  // user who submitted the quiz will see his own given answers
  // and correct answers
  // to be able to check where he/she made mistakes
  // not possible to edit
  const isSubmittedQuiz = quizStatus === "submitted";
  // if a quiz is published, the author cannot edit it but can view
  // the quiz with correct answers
  // not possible to edit
  const isByAuthorQuiz = quizStatus === "by-author"

  return (
    <div>
      <h2>Viewing Quiz ID: {quizId}</h2>
      <p>Status: {quizStatusMessage}</p>
      {isToDoQuiz && (
        <QuizForm quizId={quizId!} />
      )}

      {isInProgressQuiz && (
        // TODO modify quiz form to prefill data saved in the submission with completed === false
        <QuizForm quizId={quizId!} />
      )}

      {isSubmittedQuiz && (
        // TODO create view with div's instead of form and inputs but with the same styling
        // and optional rendering of correct and given answers 
        <QuizForm quizId={quizId!} />
      )}

      {isByAuthorQuiz && (
        // TODO create view with div's instead of form and inputs but with the same styling
        // and optional rendering of correct answers 
        <QuizForm quizId={quizId!} />
      )}

      {!['to-do', 'in-progress', 'submitted', 'by-author'].includes(quizStatus) && (
        <div>
          Quiz not found
        </div>
      )}
    </div>
  );
}