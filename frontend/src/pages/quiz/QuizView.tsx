import QuizForm from '@/components/forms/QuizForm';
import { useParams, useSearchParams } from 'react-router';

export default function QuizView() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();

  const quizStatus = searchParams.get('status'); // e.g., 'submitted', 'in-progress', ...

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

  return (
    <div>
      <h2>Viewing Quiz ID: {quizId}</h2>
      <p>Status: {quizStatusMessage}</p>
      {quizStatus === 'to-do' && (
        <QuizForm/>
      )}
    </div>
  );
}