import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },

    email: String,
    firstName: String,
    lastName: String,

    skills: [String],
    role: String,

    readiness: {
      type: Number,
      default: 0,
    },

    // 🔥 ADD THIS
    aiInsights: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);