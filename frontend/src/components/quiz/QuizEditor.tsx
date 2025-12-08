import type { AnswerOption, OriginalQuizData, Question } from "@/interfaces";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCircle2, CheckSquare, Circle, GripVertical, Plus, Square, Trash2, X } from "lucide-react";
import { Switch } from "../ui/switch";
import { v4 as uuidv4 } from 'uuid';

type SaveResult =
  | { success: true; data: any }
  | { success: false; errors: string[] };

// Helper functions to normalize questions data from backend to format used in client
// Question format backend:
// {
//   id: "q-q7r8s9t0",
//   text: "Which of the following are benefits of using React?",
//   type: "multiple",
//   answerOptions: [
//     { id: "o-u1v2w3x4", text: "Virtual DOM for performance" },
//     { id: "o-y5z6a7b8", text: "Server-side rendering only" },
//     { id: "o-c9d0e1f2", text: "Reusable components" },
//     { id: "o-g3h4i5j6", text: "Direct manipulation of the real DOM" }
//   ],
//   correctAnswers: [
//     { id: "ca-p9o8i7", answerOptionId: "o-u1v2w3x4" },
//     { id: "ca-d6e5f4", answerOptionId: "o-c9d0e1f2" }
//   ]
// }
// Question format frontend:
// {
//   id: "q-q7r8s9t0",
//   text: "Which of the following are benefits of using React?",
//   type: "multiple",
//   answerOptions: [
//     { id: "o-u1v2w3x4", text: "Virtual DOM for performance", isCorrect: true, correctAnswerId: "ca-p9o8i7" },
//     { id: "o-y5z6a7b8", text: "Server-side rendering only", isCorrect: false, correctAnswerId: null },
//     { id: "o-c9d0e1f2", text: "Reusable components", isCorrect: true, correctAnswerId: "o-c9d0e1f2" },
//     { id: "o-g3h4i5j6", text: "Direct manipulation of the real DOM", isCorrect: false, correctAnswerId: null }
//   ],
// }
const normalizeQuestions = (originalData: OriginalQuizData): Question[] => {
  return originalData.questions.map(question => {
    // For quick lookup of correct answer id's
    const correctAnswersMap = new Map(question.correctAnswers.map(correctAnswer => [correctAnswer.answerOptionId, correctAnswer.id]));

    const answerOptions: AnswerOption[] = question.answerOptions.map(answerOption => ({
      id: answerOption.id,
      text: answerOption.text,
      isCorrect: correctAnswersMap.has(answerOption.id),
      correctAnswerId: correctAnswersMap.get(answerOption.id) || null,
    }));

    return {
      id: question.id,
      text: question.text,
      type: question.type,
      answerOptions,
    };
  });
};

const QuizEditor = ({
  originalQuizEditorState,
  discardEventId,
  saveEventId,
  onSaveResult,
}: {
  originalQuizEditorState: OriginalQuizData
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

  // Internal Quiz Editor state

  // Original state is saved to calc the diff and be able to discard
  const [originalTitle] = useState(originalQuizEditorState.title);
  const [originalQuestions] = useState<Question[]>(() =>
    normalizeQuestions(originalQuizEditorState)
  );

  // Editable state
  const [quizTitle, setQuizTitle] = useState(originalTitle);
  const [questions, setQuestions] = useState<Question[]>(originalQuestions);

  // Functions to update state

  // Questions
  const addQuestion = (): void => {
    const newId = uuidv4();
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: newId,
        text: "",
        type: "single",
        answerOptions: [{
          id: uuidv4(),
          text: "",
          isCorrect: false,
          correctAnswerId: null
        }]
      }
    ]);
  };

  const removeQuestion = (qId: string): void => {
    setQuestions((prevQuestions) => prevQuestions.filter(q => q.id !== qId));
  };

  const updateQuestionText = (qId: string, text: string): void => {
    setQuestions((prevQuestions) => prevQuestions.map(q => q.id === qId ? { ...q, text } : q));
  };

  const toggleQuestionType = (qId: string): void => {
    setQuestions((prevQuestions) => prevQuestions.map(q => {
      if (q.id === qId) {
        const newType = q.type === 'single' ? 'multiple' : 'single';
        let foundCorrect = false;
        const newAnswerOptions = q.answerOptions.map(ao => {
          if (newType === 'single') {
            // only the first correct answer remains correct
            if (ao.isCorrect && !foundCorrect) {
              foundCorrect = true;
              return ao;
            }
            // clear correctness status for others
            return { ...ao, isCorrect: false, correctAnswerId: null };
          }
          return ao;
        });
        return { ...q, type: newType, answerOptions: newAnswerOptions };
      }
      return q;
    }));
  };

  // AnswerOptions
  const addAnswerOption = (qId: string): void => {
    setQuestions((prevQuestions) => prevQuestions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          answerOptions: [...q.answerOptions, { id: uuidv4(), text: "", isCorrect: false, correctAnswerId: null }]
        };
      }
      return q;
    }));
  };

  const removeAnswerOption = (qId: string, aoId: string): void => {
    setQuestions((prevQuestions) => prevQuestions.map(q => {
      if (q.id === qId) {
        return { ...q, answerOptions: q.answerOptions.filter(ao => ao.id !== aoId) };
      }
      return q;
    }));
  };

  const updateAnswerOptionText = (qId: string, aoId: string, text: string): void => {
    setQuestions((prevQuestions) => prevQuestions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          answerOptions: q.answerOptions.map(ao => ao.id === aoId ? { ...ao, text } : ao)
        };
      }
      return q;
    }));
  };

  const toggleCorrectAnswer = (qId: string, aoId: string): void => {
    setQuestions((prevQuestions) => prevQuestions.map(q => {
      if (q.id === qId) {
        const isSingle = q.type === 'single';
        return {
          ...q,
          answerOptions: q.answerOptions.map(ao => {
            if (ao.id === aoId) {
              const becomingCorrect = isSingle ? true : !ao.isCorrect;

              // correct answer id is needed here to track whether a "create" or "keep" operation is needed
              // the client generated id will be in any case replaced on the server side
              const newCAId = becomingCorrect ? (ao.correctAnswerId || uuidv4()) : null;

              return { ...ao, isCorrect: becomingCorrect, correctAnswerId: newCAId };
            }
            // in single mode, uncheck everyone else and clear their correct answers
            return isSingle ? { ...ao, isCorrect: false, correctAnswerId: null } : ao;
          })
        };
      }
      return q;
    }));
  };
  //-- Functions to update state

  // Drag&drop functions
  interface DragItemRef {
    type: 'question' | 'answerOption';
    index: number;
    parentId: string | null;
  }

  const dragItem = useRef<DragItemRef | null>(null);

  const getDropTarget = (e: DragEvent<HTMLElement>): 'above' | 'below' => {
    const targetEl = e.currentTarget;
    const rect = targetEl.getBoundingClientRect();
    const mouseY = e.clientY;
    return (mouseY < rect.top + rect.height / 2) ? 'above' : 'below';
  };

  const removeHighlight = (targetEl: HTMLElement | null): void => {
    if (!targetEl || !(targetEl instanceof HTMLElement)) return;
    targetEl.classList.remove('border-t', 'border-b', 'border-2', 'border-dashed', 'border-zinc-400');
  };

  const highlightDropTarget = (e: DragEvent<HTMLElement>, position: 'above' | 'below'): void => {
    const targetEl = e.currentTarget;
    const highlightClass = 'border-2 border-dashed border-zinc-400';
    if (!targetEl) return;
    removeHighlight(targetEl);
    if (position === 'above') {
      targetEl.classList.add('border-t', highlightClass);
    } else {
      targetEl.classList.add('border-b', highlightClass);
    }
  };

  const onDragStart = (e: DragEvent<HTMLElement>, type: 'question' | 'answerOption', index: number, parentId: string | null = null): void => {
    const draggableContainer = e.currentTarget as HTMLElement;
    const dragHandle = draggableContainer.querySelector('.drag-handle');

    if (!dragHandle) {
      e.preventDefault();
      return;
    }

    const handleRect = dragHandle.getBoundingClientRect();
    const isClickInHandle = (
      e.clientX >= handleRect.left && e.clientX <= handleRect.right &&
      e.clientY >= handleRect.top && e.clientY <= handleRect.bottom
    );

    if (!isClickInHandle) {
      e.preventDefault();
      return;
    }

    e.stopPropagation();
    dragItem.current = { type, index, parentId };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify(dragItem.current));
    // opacity and shadow are added to the dragged item
    (e.currentTarget as HTMLElement).classList.add('opacity-40', 'shadow-xl');
  };

  const onDragEnd = (e: DragEvent<HTMLElement>): void => {
    // clean up drop targets (remove borders)
    document.querySelectorAll('.answerOption-item, .question-item').forEach(el => removeHighlight(el as HTMLElement));

    // clean up the dragged item (remove opacity and shadow)
    e.currentTarget.classList.remove('opacity-40', 'shadow-xl');

    dragItem.current = null;
  };

  const onDragOverAnswerOption = (e: DragEvent<HTMLElement>): void => {
    e.preventDefault();
    if (dragItem.current && dragItem.current.type === 'answerOption') {
      const target = getDropTarget(e);
      highlightDropTarget(e, target);
      e.dataTransfer.dropEffect = "move";
    }
  };

  const onDragLeaveAnswerOption = (e: DragEvent<HTMLElement>): void => {
    if (e.relatedTarget && (e.relatedTarget as HTMLElement).closest('.answerOption-item') === e.currentTarget) {
      return;
    }
    removeHighlight(e.currentTarget as HTMLElement);
  };

  const handleDropAnswerOption = (qId: string, dropIndex: number, position: 'above' | 'below'): void => {
    const draggedItem = dragItem.current;

    if (!draggedItem || draggedItem.type !== 'answerOption' || draggedItem.parentId !== qId) {
      return;
    }

    const questionIndex = questions.findIndex(q => q.id === qId);
    if (questionIndex === -1) return;

    const currentAnswerOptions = [...questions[questionIndex].answerOptions];
    const sourceIndex = draggedItem.index;

    let finalDropIndex = dropIndex;
    if (position === 'below') {
      finalDropIndex += 1;
    }

    if (sourceIndex < finalDropIndex) {
      finalDropIndex -= 1;
    }

    const [movedAnswerOption] = currentAnswerOptions.splice(sourceIndex, 1);
    currentAnswerOptions.splice(finalDropIndex, 0, movedAnswerOption);

    setQuestions(prevQuestions => prevQuestions.map((q, i) =>
      i === questionIndex ? { ...q, answerOptions: currentAnswerOptions } : q
    ));

    dragItem.current = null;
  };

  const onDropAnswerOption = (e: DragEvent<HTMLElement>, qId: string, targetIndex: number): void => {
    e.preventDefault();
    const position = getDropTarget(e);
    removeHighlight(e.currentTarget as HTMLElement);

    if (dragItem.current && dragItem.current.type === 'answerOption' && dragItem.current.parentId === qId) {
      handleDropAnswerOption(qId, targetIndex, position);
    }
  };

  const onDragOverQuestion = (e: DragEvent<HTMLElement>): void => {
    e.preventDefault();
    if (dragItem.current && dragItem.current.type === 'answerOption') {
      return;
    }
    if (dragItem.current && dragItem.current.type === 'question') {
      const target = getDropTarget(e);
      highlightDropTarget(e, target);
      e.dataTransfer.dropEffect = "move";
    }
  };

  const onDragLeaveQuestion = (e: DragEvent<HTMLElement>): void => {
    if (e.relatedTarget && (e.relatedTarget as HTMLElement).closest('.question-item') === e.currentTarget) {
      return;
    }
    removeHighlight(e.currentTarget as HTMLElement);
  };

  const handleDropQuestion = (dropIndex: number, position: 'above' | 'below'): void => {
    const draggedItem = dragItem.current;

    if (!draggedItem || draggedItem.type !== 'question') {
      return;
    }

    const currentQuestions = [...questions];
    const [draggedQuestion] = currentQuestions.splice(draggedItem.index, 1);

    let newIndex = dropIndex;
    if (position === 'below') {
      newIndex = dropIndex + 1;
    }

    if (draggedItem.index < newIndex) {
      newIndex -= 1;
    }

    currentQuestions.splice(newIndex, 0, draggedQuestion);
    setQuestions(currentQuestions);

    dragItem.current = null;
  };

  const onDropQuestion = (e: DragEvent<HTMLElement>, targetIndex: number): void => {
    e.preventDefault();

    if (dragItem.current && dragItem.current.type === 'answerOption') {
      removeHighlight(e.currentTarget as HTMLElement);
      return;
    }

    const position = getDropTarget(e);
    removeHighlight(e.currentTarget as HTMLElement);

    if (dragItem.current && dragItem.current.type === 'question') {
      handleDropQuestion(targetIndex, position);
    }
  };
  //-- Drag&drop functions

  return (
    <div>
      {/* Title Input */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <Label className="mb-2 block">Quiz Title</Label>
        <Input
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Quiz title"
          className="text-lg font-medium"
        />
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, index) => (
          <div
            key={q.id}
            draggable
            onDragStart={(e) => onDragStart(e, 'question', index, null)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOverQuestion}
            onDragLeave={onDragLeaveQuestion}
            onDrop={(e) => onDropQuestion(e, index)}
            className="group relative bg-white rounded-xl border border-zinc-200 shadow-sm transition-all hover:shadow-lg question-item"
          >

            {/* Question Header */}
            <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-zinc-100 items-start sm:items-center justify-between bg-zinc-50/50 rounded-t-xl">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1">

                {/* Question drag handle */}
                <div
                  className="drag-handle cursor-grab active:cursor-grabbing hover:bg-zinc-200 h-8 w-8 rounded-full shrink-0 flex items-center justify-center transition-colors"
                  title="Drag to reorder question"
                >
                  <GripVertical size={20} className="text-zinc-500" />
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <Label className="sr-only">Question Text</Label>
                  <Input
                    value={q.text}
                    onChange={(e) => updateQuestionText(q.id, e.target.value)}
                    placeholder="Enter the question..."
                    className="bg-white md:text-lg"
                  />
                  {/* <span className="text-xs text-zinc-400 mt-1 block">Question id: {q.id}</span> */}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${q.type === 'single' ? 'text-zinc-900' : 'text-zinc-400'}`}>Single</span>
                  <Switch
                    checked={q.type === 'multiple'}
                    onCheckedChange={() => toggleQuestionType(q.id)}
                  />
                  <span className={`text-xs font-medium ${q.type === 'multiple' ? 'text-zinc-900' : 'text-zinc-400'}`}>Multiple</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeQuestion(q.id)}
                  className="text-zinc-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete Question"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>

            {/* Answer Options */}
            <div className="p-6 space-y-3 options-container">
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">
                Answer Options
              </Label>

              {q.answerOptions.map((ao, aoIndex) => (
                <div
                  key={ao.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, 'answerOption', aoIndex, q.id)}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOverAnswerOption}
                  onDragLeave={onDragLeaveAnswerOption}
                  onDrop={(e) => onDropAnswerOption(e, q.id, aoIndex)}
                  className="flex items-center bg-white border border-transparent answerOption-item transition-all duration-100"
                >
                  {/* Answer Option drag handle */}
                  <div
                    className="drag-handle cursor-grab active:cursor-grabbing hover:bg-zinc-500 w-6 h-8 rounded-md shrink-0 transition-colors mr-3 flex items-center justify-center"
                    title="Drag to reorder"
                  >
                    <GripVertical size={16} className="text-zinc-700" />
                  </div>

                  {/* Visual Toggle for Correct Answer */}
                  <button
                    onClick={() => toggleCorrectAnswer(q.id, ao.id)}
                    className={`shrink-0 transition-colors mr-3 ${ao.isCorrect ? 'text-green-600' : 'text-zinc-300 hover:text-zinc-400'}`}
                    title={ao.isCorrect ? "Correct Answer" : "Mark as Correct"}
                  >
                    {q.type === 'single' ? (
                      ao.isCorrect ? <CheckCircle2 size={24} /> : <Circle size={24} />
                    ) : (
                      q.type === 'multiple' ? (ao.isCorrect ? <CheckSquare size={24} /> : <Square size={24} />) : <></>
                    )}
                  </button>

                  <div className='flex-1'>
                    <Input
                      value={ao.text}
                      onChange={(e) => updateAnswerOptionText(q.id, ao.id, e.target.value)}
                      placeholder={`Answer Option ${aoIndex + 1}`}
                      className={`w-full ${ao.isCorrect ? 'border-green-200 bg-green-50/30 focus-visible:ring-green-500' : ''}`}
                    />
                    {/* <span className="text-xs text-zinc-400 mt-1 block">
                      Answer Option: {ao.id}
                      {ao.correctAnswerId && <span className="text-blue-500 ml-2">(CA ID: {ao.correctAnswerId.startsWith('temp-') ? 'NEW' : ao.correctAnswerId})</span>}
                    </span> */}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeAnswerOption(q.id, ao.id)}
                    className="text-zinc-400 hover:text-red-500 ml-3"
                    disabled={q.answerOptions.length <= 1}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}

              <div className="pt-2 pl-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addAnswerOption(q.id)}
                  className="gap-2 text-zinc-600"
                >
                  <Plus size={14} /> Add Answer Option
                </Button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* "Add Question" button */}
      <Button
        variant="outline"
        onClick={addQuestion}
        className="w-full py-8 border-dashed border-2 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 gap-2 text-lg h-auto"
      >
        <Plus size={24} /> Add New Question
      </Button>
    </div>

  )
};

export default QuizEditor;