import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" }, // <--- hinzufügen!
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["viewer", "editor"], default: "viewer" },
    },
  ],
}, {
  timestamps: true
});

export default mongoose.model("Board", BoardSchema);