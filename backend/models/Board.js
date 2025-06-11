import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["viewer"], default: "viewer" }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Board", boardSchema);
