import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();

/* Middleware */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "Velocity backend running 🚀" });
});

app.use("/api/users", userRoutes);
export default app;