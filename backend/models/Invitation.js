import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // expire après 24h
});

export default mongoose.model("Invitation", invitationSchema);