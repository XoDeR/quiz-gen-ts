// queries:
//  useQuiz params: 
//    withSubmission = true
// mutations: 
//    useUpdateSubmission
interface Props {
  quizId: string;
};

const QuizViewInProgress = ({ quizId }: Props) => {
  return (
    <div>QuizViewInProgress</div>
  )
}

export default QuizViewInProgress;