// 📁 models/Board.js
import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
    // unique: true // 👉 optionnel, si tu veux un titre unique par utilisateur
  },
  tasks: {
    type: [String],
    default: []
  },
  archived: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      role: {
        type: String,
        enum: ["viewer", "editor", "admin"],
        default: "viewer"
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Board", boardSchema);
