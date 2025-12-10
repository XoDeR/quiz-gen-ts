import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config"; // does the same as import dotenv + call dotenv.config()
import { initDb } from "./services/db";
import authRoutes from "./routes/authRoutes";
import quizRoutes from "./routes/quizRoutes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",       // dev
  "https://myapp.com",         // production
  "https://staging.myapp.com", // optional
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
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
