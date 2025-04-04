import express from "express";
import Task from "../models/taskModel.js"; // Ensure this model is created
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("🔹 Full Request Body:", req.body);

    const { title, status, assignedTo, priority, dueDate } = req.body;

    if (!title || !status || !assignedTo || !priority || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTask = new Task({
      title,
      status,
      assignedTo,
      priority,
      dueDate
    });

    await newTask.save();
    console.log("✅ Task saved:", newTask);

    res.status(201).json(newTask);
  } catch (error) {
    console.error("❌ Error adding task:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
