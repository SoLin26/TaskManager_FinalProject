import mongoose from "mongoose";

const { Schema } = mongoose;

const todoSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: String,
  subCategory: String,
  date: String,
  priority: String,
  description: String
}, { timestamps: true });

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
