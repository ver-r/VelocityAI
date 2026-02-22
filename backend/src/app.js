import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import trendsRoutes from "./routes/trends.routes.js";
const app = express();

/* Middleware */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "Velocity backend running 🚀" });
});

app.use("/api/users", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/trends", trendsRoutes);
export default app;

