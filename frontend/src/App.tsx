import './App.css'

import { Routes, Route } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quizzes from "./pages/Quizzes";
import CreatedQuizzes from "./pages/CreatedQuizzes";
import QuizCreate from './pages/quiz/QuizCreate';
import QuizLayout from './pages/quiz/QuizLayout';
import QuizView from './pages/quiz/QuizView';
import QuizEdit from './pages/quiz/QuizEdit';
import { useAuthStore } from './store/auth';
import { useEffect, useRef } from 'react';

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const hasFetched = useRef(false); // guard flag to call fetchMe only once

   useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      console.log("[App] calling fetchMe first time");
      fetchMe(); // get logged in user if present on app load
    }
  }, []);

  useEffect(() => {
    console.log("[App] mount");
    return () => console.log("[App] unmount");
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Quizzes />} />
        <Route path="/created-quizzes" element={<CreatedQuizzes />} />

        <Route path="/quizzes/create" element={<QuizCreate />} />

        <Route path="/quizzes/:quizId" element={<QuizLayout />}>
          <Route path="view" element={<QuizView />} />
          <Route path="edit" element={<QuizEdit />} />
        </Route>
      </Route>
    </Routes>
  );
}


