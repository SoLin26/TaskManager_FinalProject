import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Sprint = mongoose.model("Sprint", sprintSchema);
export default Sprint;
