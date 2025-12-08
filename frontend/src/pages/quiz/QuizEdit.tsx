import QuizEditor from "@/components/quiz/QuizEditor";
import { Button } from "@/components/ui/button";
import type { OriginalQuizData } from "@/interfaces";
import { Save } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const MOCK_ORIGINAL_QUIZ_DATA: OriginalQuizData = {
  title: "React Basics",
  isPublished: false,
  questions: [
    {
      id: "q-a1b2c3d4",
      text: "Which method is used to update state in a functional component?",
      type: "single",
      answerOptions: [
        { id: "o-e5f6g7h8", text: "this.setState()" },
        { id: "o-i9j0k1l2", text: "useState hook's setter function" },
        { id: "o-m3n4o5p6", text: "forceUpdate()" }
      ],
      correctAnswers: [
        { id: "ca-x1y2z3", answerOptionId: "o-i9j0k1l2" }
      ]
    },
    {
      id: "q-q7r8s9t0",
      text: "Which of the following are benefits of using React?",
      type: "multiple",
      answerOptions: [
        { id: "o-u1v2w3x4", text: "Virtual DOM for performance" },
        { id: "o-y5z6a7b8", text: "Server-side rendering only" },
        { id: "o-c9d0e1f2", text: "Reusable components" },
        { id: "o-g3h4i5j6", text: "Direct manipulation of the real DOM" }
      ],
      correctAnswers: [
        { id: "ca-p9o8i7", answerOptionId: "o-u1v2w3x4" },
        { id: "ca-d6e5f4", answerOptionId: "o-c9d0e1f2" }
      ]
    }
  ]
};



async function saveDataToBackend(data: any) {
  const res = await fetch("/api/save", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Save failed");
  return res.json();
}

export default function QuizEdit() {
  const [discardEventId, setDiscardEventId] = useState(0);
  const [saveEventId, setSaveEventId] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const handleDiscardClicked = () => {
    setDiscardEventId((prev) => prev + 1);
  }

  const handleSaveClicked = () => {
    setSaveEventId((prev) => prev + 1);
  }

  const mutation = useMutation({
    mutationFn: saveDataToBackend,
    onSuccess: () => setErrors([]),
    onError: (err: any) => setErrors([err.message]),
  });

  const handleSaveResult = (result: { success: boolean; data?: any; errors?: string[] }) => {
    if (result.success) {
      console.log("Data sent to backend: ", result.data);
      //mutation.mutate(result.data);
    } else {
      setErrors(result.errors ?? []);
    }
  };


  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Edit Quiz</h1>
          <p className="text-zinc-500">Edit questions, reorder items, and mark correct answers.</p>
        </div>

        <QuizEditor
          originalQuizEditorState={MOCK_ORIGINAL_QUIZ_DATA}
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
  )
}