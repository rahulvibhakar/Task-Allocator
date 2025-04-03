import express from "express";
import Task from "../models/taskModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("🔹 Full Request Received:", req);
    console.log("🔹 Request Headers:", req.headers);
    console.log("🔹 Request Body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { title, status, assignedTo, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({ title, status, assignedTo, priority, dueDate });
    await newTask.save();
    console.log("✅ Task saved:", newTask);

    res.status(201).json(newTask);
  } catch (error) {
    console.error("❌ Error adding task:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
