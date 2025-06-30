import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, default: "viewer" },
  token: { type: String, required: true, unique: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // 24h Ablauf
});

export default mongoose.model("Invitation", invitationSchema);