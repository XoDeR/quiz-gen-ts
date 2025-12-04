import { useParams, useSearchParams } from 'react-router';

export default function QuizView() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();

  const status = searchParams.get('status'); // e.g., 'submitted', 'in-progress', ...

  let quizStatusMessage = '';
  switch (status) {
    case 'submitted':
      quizStatusMessage = 'This quiz has been submitted.';
      break;
    case 'in-progress':
      quizStatusMessage = 'This quiz is currently in progress.';
      break;
    case 'to-do':
      quizStatusMessage = 'This quiz is pending and needs to be started.';
      break;
    default:
      quizStatusMessage = 'Default quiz view.';
  }

  return (
    <div>
      <h2>Viewing Quiz ID: {quizId}</h2>
      <p>Status: {quizStatusMessage}</p>
    </div>
  );
}