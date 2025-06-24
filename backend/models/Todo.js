import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  boardId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Board" },
  title: { type: String, required: true },
  column: { type: String, required: true },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
