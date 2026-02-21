import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

/**
 * POST /api/quiz/submit
 * Save quiz data for logged-in user
 */
router.post("/submit", requireAuth, async (req, res) => {
  try {
    const { skills, role } = req.body;
    const clerkId = req.user.sub;

    // very simple readiness logic for now
    const readiness = Math.min(100, skills.length * 10);

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        role,
        skills,
        readiness,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Quiz saved",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;