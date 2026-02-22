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

    console.log("🔍 Calling AI service with:", skillText);

    /* 2️⃣ Call AI service */
    let aiData = null;
    try {
      const aiResponse = await fetch(
        `${process.env.AI_SERVICE_URL}/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: skillText }),
        }
      );

      if (!aiResponse.ok) {
        console.error("❌ AI service returned error:", aiResponse.status);
        throw new Error(`AI service returned ${aiResponse.status}`);
      }

      aiData = await aiResponse.json();
      console.log("✅ AI service response received");
    } catch (aiError) {
      console.error("❌ AI service error:", aiError.message);
      // Continue without AI data instead of failing completely
      aiData = {
        matched_roles: [],
        skill_decline_risk: [],
        role_decline_analysis: [],
        error: "AI service unavailable"
      };
    }

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

    console.log("✅ User data saved successfully");

    /* 5️⃣ Return enriched response */
    res.json({
      user,
      aiInsights: aiData,
    });
  } catch (err) {
    console.error("❌ Quiz processing failed:", err);
    res.status(500).json({ message: "Quiz processing failed", error: err.message });
  }
});

export default router;