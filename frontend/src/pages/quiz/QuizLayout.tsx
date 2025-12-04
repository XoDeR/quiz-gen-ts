import { Outlet } from "react-router";

export default function QuizLayout() {
  return (
    <div className="quiz-layout">
      {/* Shared for quiz pages */}
      <Outlet />
    </div>
  );
}