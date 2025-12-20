// queries:
//  useQuiz params: 
//    withAnswers = true
//    withSubmission = true
// mutations: none
interface Props {
  quizId: string;
};

const QuizViewSubmitted = ({ quizId }: Props) => {
  return (
    <div>QuizViewSubmitted</div>
  )
}

export default QuizViewSubmitted;