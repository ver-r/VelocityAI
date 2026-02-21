import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/submit", requireAuth, async (req, res) => {
  const { skills, role } = req.body;

  if (!skills || !role) {
    return res.status(400).json({ message: "Missing data" });
  }

  const clerkId = req.user.sub;

  const readiness = Math.min(100, skills.length * 10);

  const user = await User.findOneAndUpdate(
    { clerkId },
    { skills, role, readiness },
    { new: true, upsert: true }
  );

  res.json(user);
});

export default router;