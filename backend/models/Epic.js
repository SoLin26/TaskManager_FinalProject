
import mongoose from "mongoose";

const epicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const Epic = mongoose.model("Epic", epicSchema);
export default Epic;
