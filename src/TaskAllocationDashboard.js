import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Define API URL at the top
const API_URL = "http://localhost:5000/api";

const TaskAllocationDashboard = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from backend
  useEffect(() => {
    axios.get(`${API_URL}/tasks`)  // ✅ Ensure it matches backend route
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => console.error("❌ Error fetching tasks:", error));
  }, []);

  return (
    <div>
      <h1>Task Allocation Dashboard</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>{task.title} - {task.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskAllocationDashboard;
