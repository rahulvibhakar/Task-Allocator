import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import allocationRoutes from "./routes/allocation.js";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();
const app = express();

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Stop the server if MongoDB fails
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route for testing
app.get("/", (req, res) => {
  res.send("🎯 Task Allocation Backend is running!");
});

// Task Allocation Routes
app.use("/allocate-task", allocationRoutes);

const PORT = process.env.PORT || 5000;

// ✅ Start the server **only after MongoDB connects**
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔗 Task Allocation endpoint: http://localhost:${PORT}/allocate-task`);
  });
});
