import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer 
} from 'recharts';
import { Users, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

const TaskAllocationDashboard = () => {
  // State Variables
  const [teamMembers, setTeamMembers] = useState(() => {
  const savedMembers = localStorage.getItem('teamMembers');
  return savedMembers ? JSON.parse(savedMembers) : [
    { id: 0, name: "John Doe", skills: ["Python", "Data Analysis"], workload: 1, capacity: 1 },
    { id: 1, name: "Jane Smith", skills: ["JavaScript", "React"], workload: 1, capacity: 1 }
  ];
});

const [tasks, setTasks] = useState(() => {
  const savedTasks = localStorage.getItem('tasks');
  return savedTasks ? JSON.parse(savedTasks) : [
    { id: 0, title: "Develop API", status: "in_progress", assignedTo: 0, priority: "High", dueDate: "2025-04-07" },
    { id: 1, title: "Create UI", status: "assigned", assignedTo: 1, priority: "Medium", dueDate: "2025-04-05" }
  ];
});
// Add these useEffect hooks after your state variable declarations
useEffect(() => {
  localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
}, [teamMembers]);

useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Form states
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [memberFormData, setMemberFormData] = useState({ name: '', skills: '' });
  const [taskFormData, setTaskFormData] = useState({ title: '', priority: 'Medium', dueDate: '' });

  // Workload Chart Data
  const workloadData = teamMembers.map(member => ({
    name: member.name, 
    Current: member.workload, 
    Available: member.workload === 0 ? 1 : 0 // Either available (1) or not (0)
  }));

  // Handle Member Form Input
  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setMemberFormData({...memberFormData, [name]: value});
  };

  // Handle Task Form Input
  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({...taskFormData, [name]: value});
  };
  // Add these functions after your existing handler functions
const exportData = () => {
  const dataToExport = {
    teamMembers,
    tasks,
    exportDate: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(dataToExport, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.download = `task-allocation-backup-${new Date().toISOString().slice(0,10)}.json`;
  link.href = url;
  link.click();
};

const importData = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);
      
      // Validate data structure
      if (importedData.teamMembers && importedData.tasks) {
        setTeamMembers(importedData.teamMembers);
        setTasks(importedData.tasks);
        alert("Data imported successfully!");
      } else {
        alert("Invalid data format. Import failed.");
      }
    } catch (error) {
      alert(`Error importing data: ${error.message}`);
    }
  };
  reader.readAsText(file);
  // Reset file input
  e.target.value = null;
};

const resetData = () => {
  if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
    localStorage.removeItem('teamMembers');
    localStorage.removeItem('tasks');
    setTeamMembers([
      { id: 0, name: "John Doe", skills: ["Python", "Data Analysis"], workload: 1, capacity: 1 },
      { id: 1, name: "Jane Smith", skills: ["JavaScript", "React"], workload: 1, capacity: 1 }
    ]);
    setTasks([
      { id: 0, title: "Develop API", status: "in_progress", assignedTo: 0, priority: "High", dueDate: "2025-04-07" },
      { id: 1, title: "Create UI", status: "assigned", assignedTo: 1, priority: "Medium", dueDate: "2025-04-05" }
    ]);
    alert("All data has been reset to default values.");
  }
};

  // Add Team Member
  const addTeamMember = (e) => {
    e.preventDefault();
    const name = memberFormData.name;
    const skills = memberFormData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
    if (name && skills.length) {
      if (editingMemberId !== null) {
        setTeamMembers(teamMembers.map(m => (m.id === editingMemberId ? { ...m, name, skills } : m)));
        setEditingMemberId(null);
      } else {
        setTeamMembers([...teamMembers, { id: teamMembers.length, name, skills, workload: 0, capacity: 1 }]);
      }
      setMemberFormData({ name: '', skills: '' });
      setShowMemberForm(false);
    }
  };

  // Edit Team Member
  const editTeamMember = (id) => {
    const member = teamMembers.find(m => m.id === id);
    if (!member) return;
    setMemberFormData({ name: member.name, skills: member.skills.join(', ') });
    setEditingMemberId(id);
    setShowMemberForm(true);
  };

  // Delete Team Member
  const deleteTeamMember = (id) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
    }
  };

  // Add Task
  const addTask = (e) => {
    e.preventDefault();
    const { title, priority, dueDate } = taskFormData;
    if (title && priority && dueDate) {
      if (editingTaskId !== null) {
        setTasks(tasks.map(t => (t.id === editingTaskId ? { ...t, title, priority, dueDate } : t)));
        setEditingTaskId(null);
      } else {
        setTasks([...tasks, { id: tasks.length, title, status: "unassigned", assignedTo: null, priority, dueDate }]);
      }
      setTaskFormData({ title: '', priority: 'Medium', dueDate: '' });
      setShowTaskForm(false);
    }
  };

  // Edit Task
  const editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTaskFormData({ title: task.title, priority: task.priority, dueDate: task.dueDate });
    setEditingTaskId(id);
    setShowTaskForm(true);
  };

  // Delete Task
  const deleteTask = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  // Mark Task as Complete
  const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.assignedTo) return;
    
    // Update task status
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, status: "completed" } : t)));
    
    // Free up the team member
    setTeamMembers(teamMembers.map(m => 
      m.id === task.assignedTo ? { ...m, workload: 0 } : m
    ));
    
    alert("Task marked as complete. Team member is now available for new tasks.");
  };

  // Get Status Label
  const getStatusLabel = (status) => {
    const statusMap = {
      'unassigned': 'Unassigned',
      'assigned': 'Assigned',
      'in_progress': 'In Progress',
      'completed': 'Completed'
    };
    return statusMap[status] || status;
  };
  // Replace the autoAllocate function with this improved version
const autoAllocate = (taskId) => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  // Create a mapping of related terms for better skill matching
  const skillRelations = {
    // Database & Backend
    "dbms": ["database", "sql", "query", "schema", "optimization", "oracle", "postgresql", "mysql", "nosql", "mongodb"],
    "database": ["dbms", "sql", "query", "schema", "optimization", "postgresql", "mongodb", "oracle"],
    "sql": ["dbms", "query", "database", "mysql", "postgresql", "oracle", "mssql"],
    "mongodb": ["nosql", "database", "document store", "json", "schema design"],
    "postgresql": ["sql", "database", "dbms", "query optimization", "indexing"],
    "mysql": ["sql", "database", "dbms", "query optimization", "stored procedures"],
    "backend": ["api", "server", "database", "node", "express", "django", "flask", "ruby on rails", "spring boot"],
    "api": ["backend", "rest", "graphql", "json", "swagger", "postman"],
    "rest": ["api", "json", "http", "backend", "express", "django"],
    "graphql": ["api", "backend", "query language", "apollo", "relay"],
    
    // Frontend
    "frontend": ["ui", "interface", "react", "angular", "vue", "javascript", "html", "css", "tailwind", "bootstrap"],
    "javascript": ["react", "angular", "vue", "node", "frontend", "ui", "es6", "typescript"],
    "typescript": ["javascript", "frontend", "backend", "angular", "react"],
    "react": ["frontend", "ui", "javascript", "component", "interface", "next.js"],
    "angular": ["frontend", "ui", "typescript", "javascript", "rxjs"],
    "vue": ["frontend", "ui", "javascript", "vuex"],
    "html": ["frontend", "css", "web development"],
    "css": ["frontend", "html", "responsive design", "flexbox", "grid"],
    "tailwind": ["css", "frontend", "responsive design"],
    "bootstrap": ["css", "frontend", "ui", "responsive design"],
  
    // Python & AI/ML
    "python": ["django", "flask", "data", "analysis", "machine learning", "ai", "pandas", "numpy", "tensorflow"],
    "data analysis": ["python", "statistics", "visualization", "reporting", "analytics", "power bi", "tableau"],
    "machine learning": ["python", "tensorflow", "pytorch", "scikit-learn", "ai", "deep learning"],
    "deep learning": ["machine learning", "tensorflow", "pytorch", "neural networks", "cnn", "rnn"],
    "ai": ["machine learning", "deep learning", "nlp", "computer vision"],
    "nlp": ["ai", "machine learning", "transformers", "text processing"],
    "computer vision": ["ai", "deep learning", "opencv", "image processing"],
  
    // DevOps & Cloud
    "devops": ["docker", "kubernetes", "ci/cd", "jenkins", "terraform"],
    "docker": ["devops", "kubernetes", "containers", "microservices"],
    "kubernetes": ["devops", "docker", "orchestration"],
    "aws": ["cloud", "devops", "lambda", "s3", "ec2"],
    "azure": ["cloud", "devops", "ai studio", "functions"],
    "gcp": ["cloud", "bigquery", "compute engine"],
  
    // Software Engineering & Misc
    "c++": ["oop", "competitive programming", "game development", "performance optimization"],
    "java": ["backend", "spring boot", "oop", "android development"],
    "spring boot": ["java", "backend", "microservices"],
    "android": ["java", "kotlin", "mobile development"],
    "flutter": ["mobile development", "dart", "cross-platform"],
    "swift": ["ios", "mobile development", "apple ecosystem"],
    "cybersecurity": ["penetration testing", "network security", "encryption", "ethical hacking"],
    "blockchain": ["cryptocurrency", "smart contracts", "ethereum", "web3"],
    "web3": ["blockchain", "smart contracts", "solidity", "decentralized applications"]
  };
  
  
  // Function to check if a skill is relevant to the task
  const isSkillRelevant = (skill, taskTitle) => {
    const normalizedSkill = skill.toLowerCase();
    const normalizedTitle = taskTitle.toLowerCase();
    
    // Direct match
    if (normalizedTitle.includes(normalizedSkill)) {
      return true;
    }
    
    // Check related terms
    for (const [key, relatedTerms] of Object.entries(skillRelations)) {
      if (normalizedSkill === key || normalizedSkill.includes(key)) {
        // If the skill matches a key in our relations map
        if (relatedTerms.some(term => normalizedTitle.includes(term))) {
          return true;
        }
      }
      
      if (normalizedTitle.includes(key)) {
        // If the task title contains a key that's related to this skill
        if (relatedTerms.includes(normalizedSkill) || 
            relatedTerms.some(term => normalizedSkill.includes(term))) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Only consider members with no current workload (not assigned to any task)
  const availableMembers = teamMembers.filter(m => 
    m.workload === 0 && m.skills.some(skill => isSkillRelevant(skill, task.title))
  );
  
  if (availableMembers.length > 0) {
    const assignedMember = availableMembers[0];
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, assignedTo: assignedMember.id, status: "assigned" } : t)));
    setTeamMembers(teamMembers.map(m => 
      m.id === assignedMember.id ? { ...m, workload: 1 } : m
    ));
    alert(`Task assigned to ${assignedMember.name} based on skills and availability.`);
  } else {
    alert("No available team members with matching skills. All members are currently assigned to tasks.");
  }
};

  // Manually Assign Task
  const manuallyAssignTask = (taskId, memberId) => {
    const task = tasks.find(t => t.id === taskId);
    const member = teamMembers.find(m => m.id === memberId);
    if (!task || !member) return;
    
    if (member.workload > 0) {
      alert(`${member.name} is already assigned to another task.`);
      return;
    }
    
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, assignedTo: memberId, status: "assigned" } : t)));
    setTeamMembers(teamMembers.map(m => 
      m.id === memberId ? { ...m, workload: 1 } : m
    ));
    setShowAllocationForm(false);
    setSelectedTaskId(null);
    alert(`Task manually assigned to ${member.name}.`);
  };

  // Get suitable team members for a task
  const getSuitableMembersForTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return [];
    
    // Only return team members with no current workload
    return teamMembers.filter(m => m.workload === 0);
  };

  // Check if a team member is available
  const isTeamMemberAvailable = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member && member.workload === 0;
  };

  // Get what task a team member is working on
  const getAssignedTaskForMember = (memberId) => {
    return tasks.find(t => t.assignedTo === memberId && t.status !== 'completed');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
<header className="bg-blue-600 text-white p-4">
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold">Task Allocation AI</h1>
    <div className="flex space-x-2">
      <button 
        onClick={exportData} 
        className="px-3 py-1 bg-green-700 text-white rounded text-sm"
      >
        Export Data
      </button>
      <label className="px-3 py-1 bg-yellow-600 text-white rounded text-sm cursor-pointer">
        Import Data
        <input 
          type="file" 
          accept=".json" 
          className="hidden" 
          onChange={importData} 
        />
      </label>
      <button 
        onClick={resetData} 
        className="px-3 py-1 bg-red-700 text-white rounded text-sm"
      >
        Reset All
      </button>
    </div>
  </div>
</header>
      

      {/* Navigation */}
      <nav className="bg-gray-100 p-2 flex space-x-4">
        {["dashboard", "team", "tasks", "allocations"].map(tab => (
          <button 
            key={tab} 
            className={`px-3 py-2 rounded ${activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Team Availability</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workloadData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 1]} ticks={[0, 1]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Current" fill="#3B82F6" name="Busy" />
                  <Bar dataKey="Available" fill="#93C5FD" name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Task Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 p-3 rounded-lg flex items-center">
                  <div className="bg-blue-500 p-2 rounded-full text-white mr-3">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Tasks</p>
                    <p className="text-xl font-semibold">{tasks.length}</p>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg flex items-center">
                  <div className="bg-green-500 p-2 rounded-full text-white mr-3">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assigned</p>
                    <p className="text-xl font-semibold">{tasks.filter(t => t.status === 'assigned' || t.status === 'in_progress').length}</p>
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg flex items-center">
                  <div className="bg-yellow-500 p-2 rounded-full text-white mr-3">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Team Members</p>
                    <p className="text-xl font-semibold">{teamMembers.length}</p>
                  </div>
                </div>
                <div className="bg-red-100 p-3 rounded-lg flex items-center">
                  <div className="bg-red-500 p-2 rounded-full text-white mr-3">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Unassigned</p>
                    <p className="text-xl font-semibold">{tasks.filter(t => t.status === 'unassigned').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Management */}
        {activeTab === 'team' && (
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Team Members</h2>
              <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => {
                setMemberFormData({ name: '', skills: '' });
                setEditingMemberId(null);
                setShowMemberForm(true);
              }}>+ Add Member</button>
            </div>

            {/* Member Form */}
            {showMemberForm && (
              <div className="bg-gray-100 p-4 mb-4 rounded">
                <h3 className="font-medium mb-2">{editingMemberId !== null ? 'Edit' : 'Add'} Team Member</h3>
                <form onSubmit={addTeamMember}>
                  <div className="mb-3">
                    <label className="block text-sm mb-1">Name:</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={memberFormData.name} 
                      onChange={handleMemberInputChange} 
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm mb-1">Skills (comma separated):</label>
                    <input 
                      type="text" 
                      name="skills" 
                      value={memberFormData.skills} 
                      onChange={handleMemberInputChange} 
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                    <button type="button" className="px-3 py-1 bg-gray-400 text-white rounded" onClick={() => setShowMemberForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Members List */}
            <ul className="divide-y">
              {teamMembers.map(member => {
                const assignedTask = getAssignedTaskForMember(member.id);
                return (
                  <li key={member.id} className="flex justify-between items-center py-3">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">Skills: {member.skills.join(', ')}</p>
                      <p className="text-sm text-gray-500">
                        Status: {member.workload === 0 ? (
                          <span className="text-green-600">Available</span>
                        ) : (
                          <span className="text-red-600">Busy with: {assignedTask?.title || 'Unknown task'}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-2 py-1 bg-yellow-500 text-white rounded text-sm" onClick={() => editTeamMember(member.id)}>Edit</button>
                      <button className="px-2 py-1 bg-red-500 text-white rounded text-sm" onClick={() => deleteTeamMember(member.id)}>Delete</button>
                    </div>
                  </li>
                );
              })}
              {teamMembers.length === 0 && <p className="text-gray-500 py-4 text-center">No team members added yet.</p>}
            </ul>
          </div>
        )}

        {/* Task Management */}
        {activeTab === 'tasks' && (
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => {
                setTaskFormData({ title: '', priority: 'Medium', dueDate: '' });
                setEditingTaskId(null);
                setShowTaskForm(true);
              }}>+ Add Task</button>
            </div>

            {/* Task Form */}
            {showTaskForm && (
              <div className="bg-gray-100 p-4 mb-4 rounded">
                <h3 className="font-medium mb-2">{editingTaskId !== null ? 'Edit' : 'Add'} Task</h3>
                <form onSubmit={addTask}>
                  <div className="mb-3">
                    <label className="block text-sm mb-1">Title:</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={taskFormData.title} 
                      onChange={handleTaskInputChange} 
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm mb-1">Priority:</label>
                    <select 
                      name="priority" 
                      value={taskFormData.priority} 
                      onChange={handleTaskInputChange} 
                      className="w-full p-2 border rounded"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm mb-1">Due Date:</label>
                    <input 
                      type="date" 
                      name="dueDate" 
                      value={taskFormData.dueDate} 
                      onChange={handleTaskInputChange} 
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                    <button type="button" className="px-3 py-1 bg-gray-400 text-white rounded" onClick={() => setShowTaskForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Tasks List */}
            <ul className="divide-y">
              {tasks.map(task => (
                <li key={task.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">Priority: {task.priority} | Due: {task.dueDate}</p>
                    <p className="text-sm text-gray-500">
                      Status: {getStatusLabel(task.status)} 
                      {task.assignedTo !== null && ` | Assigned to: ${teamMembers.find(m => m.id === task.assignedTo)?.name || 'Unknown'}`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded text-sm" onClick={() => editTask(task.id)}>Edit</button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded text-sm" onClick={() => deleteTask(task.id)}>Delete</button>
                    {(task.status === 'assigned' || task.status === 'in_progress') && (
                      <button 
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                        onClick={() => completeTask(task.id)}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </li>
              ))}
              {tasks.length === 0 && <p className="text-gray-500 py-4 text-center">No tasks added yet.</p>}
            </ul>
          </div>
        )}

        {/* Allocations */}
        {activeTab === 'allocations' && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Task Allocations</h2>

            {/* Allocation Form */}
            {showAllocationForm && selectedTaskId !== null && (
              <div className="bg-gray-100 p-4 mb-4 rounded">
                <h3 className="font-medium mb-2">Manually Assign Task</h3>
                <div className="mb-3">
                  <p className="font-medium">Task: {tasks.find(t => t.id === selectedTaskId)?.title}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium mb-2">Select Team Member:</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {getSuitableMembersForTask(selectedTaskId).map(member => (
                      <div key={member.id} className="bg-white p-2 rounded border flex justify-between items-center">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">Skills: {member.skills.join(', ')}</p>
                          <p className="text-xs text-gray-500">Status: Available</p>
                        </div>
                        <button 
                          className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                          onClick={() => manuallyAssignTask(selectedTaskId, member.id)}
                        >
                          Assign
                        </button>
                      </div>
                    ))}
                    {getSuitableMembersForTask(selectedTaskId).length === 0 && (
                      <p className="text-gray-500 text-center p-2">No available team members. All members are currently assigned to tasks.</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-3 py-1 bg-gray-400 text-white rounded" onClick={() => {
                    setShowAllocationForm(false);
                    setSelectedTaskId(null);
                  }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Unassigned Tasks */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Unassigned Tasks</h3>
              <ul className="divide-y border rounded">
                {tasks.filter(t => t.status === 'unassigned').map(task => (
                  <li key={task.id} className="flex justify-between items-center p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">Priority: {task.priority} | Due: {task.dueDate}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                        onClick={() => autoAllocate(task.id)}
                      >
                        Auto Allocate
                      </button>
                      <button 
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setShowAllocationForm(true);
                        }}
                      >
                        Manually Assign
                      </button>
                    </div>
                  </li>
                ))}
                {tasks.filter(t => t.status === 'unassigned').length === 0 && (
                  <p className="text-gray-500 py-4 text-center">No unassigned tasks.</p>
                )}
              </ul>
            </div>

            {/* Assigned Tasks */}
            <div>
              <h3 className="font-medium mb-2">Assigned Tasks</h3>
              <ul className="divide-y border rounded">
                {tasks.filter(t => t.status !== 'unassigned' && t.status !== 'completed').map(task => (
                  <li key={task.id} className="flex justify-between items-center p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Status: {getStatusLabel(task.status)} | Priority: {task.priority} | Due: {task.dueDate}
                      </p>
                      <p className="text-sm text-gray-500">
                        Assigned to: {teamMembers.find(m => m.id === task.assignedTo)?.name || 'Unknown'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                        onClick={() => completeTask(task.id)}
                      >
                        Complete
                      </button>
                      <button 
                        className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
                        onClick={() => {
                          // Only show reassign if there are available members
                          if (teamMembers.some(m => m.workload === 0)) {
                            setSelectedTaskId(task.id);
                            setShowAllocationForm(true);
                          } else {
                            alert("No available team members for reassignment. All members are busy with tasks.");
                          }
                        }}
                      >
                        Reassign
                      </button>
                    </div>
                  </li>
                ))}
                {tasks.filter(t => t.status !== 'unassigned' && t.status !== 'completed').length === 0 && (
                  <p className="text-gray-500 py-4 text-center">No assigned tasks.</p>
                )}
              </ul>
            </div>

            {/* Completed Tasks */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Completed Tasks</h3>
              <ul className="divide-y border rounded">
                {tasks.filter(t => t.status === 'completed').map(task => (
                  <li key={task.id} className="flex justify-between items-center p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Status: {getStatusLabel(task.status)} | Priority: {task.priority} | Due: {task.dueDate}
                      </p>
                      <p className="text-sm text-gray-500">
                        Completed by: {teamMembers.find(m => m.id === task.assignedTo)?.name || 'Unknown'}
                      </p>
                    </div>
                  </li>
                ))}
                {tasks.filter(t => t.status === 'completed').length === 0 && (
                  <p className="text-gray-500 py-4 text-center">No completed tasks.</p>
                )}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskAllocationDashboard;