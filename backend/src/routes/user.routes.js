import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

/**
 * GET /api/users/me
 * Create user if not exists
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const clerkId = req.user.sub;

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;