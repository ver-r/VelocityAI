import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/market-trends");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch market trends" });
  }
});

export default router;