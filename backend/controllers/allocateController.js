export const allocateTasks = (req, res) => {
    console.log("📩 Received Request Body:", req.body); // 🔥 Debugging
  
    const { tasks, team_members } = req.body;
  
    if (!tasks || !team_members) {
      return res.status(400).json({ error: "❌ Tasks and team members are required!" });
    }
  
    // Allocation logic (Dummy response)
    const allocation = {};
    tasks.forEach((task, index) => {
      allocation[task] = team_members[index % team_members.length].name;
    });
  
    res.json({ allocation });
  };
  