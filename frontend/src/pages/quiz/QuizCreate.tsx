import QuizEditor from "@/components/quiz/QuizEditor";
import { Button } from "@/components/ui/button";
import { useCreateQuiz } from "@/hooks/useQuizzes";
import type { OriginalQuizData } from "@/interfaces";
import { Save } from "lucide-react";
import { useState } from "react";

// for create original quiz data is always empty
const emptyOriginalQuizData: OriginalQuizData = {
  title: "",
  isPublished: false,
  questions: [
  ]
};

export default function QuizCreate() {
  const [discardEventId, setDiscardEventId] = useState(0);
  const [saveEventId, setSaveEventId] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const mutation = useCreateQuiz();

  const handleDiscardClicked = () => {
    setDiscardEventId((prev) => prev + 1);
  }

  const handleSaveClicked = () => {
    setSaveEventId((prev) => prev + 1);
  }
  
  const handleSaveResult = (result: { success: boolean; data?: any; errors?: string[] }) => {
    if (result.success) {
      console.log("Data sent to backend: ", result.data);
      mutation.mutate(result.data, {
        onSuccess: () => setErrors([]),
        onError: (err: any) => setErrors([err.message]),
      });
    } else {
      setErrors(result.errors ?? []);
    }
  };
  
  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create Quiz</h1>
          <p className="text-zinc-500">Add questions, reorder items, and mark correct answers.</p>
        </div>
        
        <QuizEditor 
          originalQuizEditorState={emptyOriginalQuizData}
          discardEventId={discardEventId}
          saveEventId={saveEventId}
          onSaveResult={handleSaveResult}
        />

        {/* Actions buttons */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-zinc-200 p-4 -mx-4 sm:-mx-6 lg:-mx-8 mt-10 flex items-center justify-between z-10">
          {errors.length > 0 && (
            <div className="text-sm text-red-500 font-medium px-4">
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 px-4">
            <Button variant="destructive" onClick={handleDiscardClicked}>Discard Changes</Button>
            <Button onClick={handleSaveClicked} className="gap-2 px-6">
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}