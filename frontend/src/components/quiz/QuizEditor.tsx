import { useEffect, useState } from "react";

type SaveResult =
  | { success: true; data: any }
  | { success: false; errors: string[] };

const QuizEditor = ({
  discardEventId,
  saveEventId,
  onSaveResult,
}: {
  discardEventId: number;
  saveEventId: number;
  onSaveResult: (result: SaveResult) => void;
}) => {

  const [quizEditorState, setQuizEditorState] = useState({ field: "" });

  useEffect(() => {
    if (discardEventId > 0) {
      // reset to initial
      setQuizEditorState({ field: "" });
    }
  }, [discardEventId]);

  useEffect(() => {
    if (saveEventId > 0) {
      /*
      if (!quizEditorState.field) {
        onSaveResult({ success: false, errors: ["Field cannot be empty"] });
      } else {
        onSaveResult({ success: true, data: quizEditorState });
      }
      */
      // send data to parent
      onSaveResult({ success: true, data: quizEditorState });
    }
  }, [saveEventId]);

  return (
    <div>
      QuizEditor
    </div>

  )
};

export default QuizEditor;