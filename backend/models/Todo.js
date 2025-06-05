import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  column: { type: String, required: true },
  dueDate: { type: Date }, // neu: optionales Fälligkeitsdatum
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Todo", todoSchema);
