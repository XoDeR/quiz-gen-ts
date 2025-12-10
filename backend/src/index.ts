import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initDb } from "./services/db";
import authRoutes from "./routes/authRoutes";
import quizRoutes from "./routes/quizRoutes";
import "dotenv/config"; // does the same as import dotenv + call dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// For testing, health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Test: server works" });
});

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error("server error: ", error);
  }
};

startServer();
