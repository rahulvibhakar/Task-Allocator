import { useState } from "react";
import axios from "axios";

// ✅ Define API URL at the top
const API_URL = "http://localhost:5000/api"; // Ensure this matches the backend route

const AddTaskForm = () => {
  const [task, setTask] = useState({
    title: "",
    status: "Pending",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/tasks`,  // ✅ Ensure this matches backend `/api/tasks`
        task,
        { headers: { "Content-Type": "application/json" } } // ✅ Send as JSON
      );
      console.log("✅ Task added:", response.data);
    } catch (error) {
      console.error("❌ Error adding task:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Assigned To"
        value={task.assignedTo}
        onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
      />
      <input
        type="date"
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
