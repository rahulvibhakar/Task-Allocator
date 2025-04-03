import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, default: "Pending" },
  assignedTo: { type: String },
  priority: { type: String, default: "Medium" },
  dueDate: { type: Date },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
