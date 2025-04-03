import React, { useState } from 'react';
import axios from 'axios';

const TaskAllocation = () => {
    const [tasks, setTasks] = useState('');
    const [teamMembers, setTeamMembers] = useState('');
    const [allocationResult, setAllocationResult] = useState('');

    const handleTaskSubmit = async () => {
        try {
            const taskArray = tasks.split(',').map(task => task.trim());
            const memberArray = teamMembers.split(',').map(member => {
                const [name, skills] = member.split('(');
                return { name: name.trim(), skills: skills.replace(')', '').trim() };
            });

            const response = await axios.post('http://localhost:5000/allocate-task', {
                tasks: taskArray,
                team_members: memberArray
            });

            setAllocationResult(response.data.allocation);
        } catch (error) {
            console.error("Error during task allocation:", error);
        }
    };

    return (
        <div>
            <h1>Task Allocation</h1>
            <div>
                <label>Tasks (comma separated):</label>
                <input
                    type="text"
                    value={tasks}
                    onChange={(e) => setTasks(e.target.value)}
                    placeholder="e.g., Task 1, Task 2"
                />
            </div>
            <div>
                <label>Team Members (name (skills), comma separated):</label>
                <input
                    type="text"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    placeholder="e.g., Alice (Python), Bob (JavaScript)"
                />
            </div>
            <button onClick={handleTaskSubmit}>Allocate Tasks</button>

            {allocationResult && (
                <div>
                    <h3>Task Allocation Result:</h3>
                    <p>{allocationResult}</p>
                </div>
            )}
        </div>
    );
};

export default TaskAllocation;
