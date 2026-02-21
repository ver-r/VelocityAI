import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/submit", requireAuth, async (req, res) => {
  try {
    const { skills, role } = req.body;

    if (!skills || !role) {
      return res.status(400).json({ message: "Missing data" });
    }

    const clerkId = req.user.sub;

    /* 1️⃣ Convert skills → AI input */
    const skillText = skills.join(", ");

    /* 2️⃣ Call AI service */
    const aiResponse = await fetch(
      `${process.env.AI_SERVICE_URL}/analyze`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: skillText }),
      }
    );

    if (!aiResponse.ok) {
      throw new Error("AI service failed");
    }

    const aiData = await aiResponse.json();

    /* 3️⃣ Compute readiness (temporary logic) */
    const readiness = Math.min(100, skills.length * 10);

    /* 4️⃣ Save everything */
    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        skills,
        role,
        readiness,
        aiInsights: aiData, // 🔥 store AI output
      },
      { new: true, upsert: true }
    );

    /* 5️⃣ Return enriched response */
    res.json({
      user,
      aiInsights: aiData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Quiz processing failed" });
  }
});

export default router;