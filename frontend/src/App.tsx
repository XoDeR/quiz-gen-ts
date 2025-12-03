import './App.css'

import { Routes, Route } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quizzes from "./pages/Quizzes";
import CreatedQuizzes from "./pages/CreatedQuizzes";

export default function App() {
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
      </Route>
    </Routes>
  );
}


