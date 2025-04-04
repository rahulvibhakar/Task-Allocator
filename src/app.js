import { useEffect } from "react";

function App() {
  useEffect(() => {
    const addTask = async () => {
      const taskData = {
        title: "Task A",
        status: "pending",
        assignedTo: "Alice",
        priority: "high",
        dueDate: "2025-04-05"
      };

      try {
        const response = await fetch("http://localhost:5000/allocate-task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(taskData)
        });

        const data = await response.json();
        console.log("✅ Task Added Successfully:", data);
      } catch (error) {
        console.error("❌ Error Adding Task:", error);
      }
    };

    addTask(); // Run when component loads
  }, []);

  return <h1>Task Allocation Dashboard</h1>;
}

export default App;
