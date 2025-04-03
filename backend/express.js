import express from 'express';
import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());  // Middleware to parse JSON

const PORT = process.env.PORT || 5000;

// Initialize the Hugging Face Inference Client
const client = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN); // Ensure your token is set in .env file

// Test route for the root endpoint (optional)
app.get('/', (req, res) => {
    res.send("Server is up and running!");
});

app.post('/allocate-task', async (req, res) => {
    const { tasks, team_members } = req.body;

    if (!tasks || !team_members) {
        return res.status(400).json({ error: 'Missing tasks or team members' });
    }

    // Format the input data for the Hugging Face model
    const taskDescription = tasks.join(', ');
    const teamDescription = team_members.map(member => `${member.name} (${member.skills})`).join(', ');

    const inputText = `Given these tasks: ${taskDescription}. And the following team members: ${teamDescription}, allocate the tasks appropriately.`;

    try {
        // Call Hugging Face Inference API
        const chatCompletion = await client.chatCompletion({
            provider: 'hf-inference',
            model: 'mistralai/Mistral-7B-Instruct-v0.2', // Update with your model
            messages: [
                {
                    role: 'user',
                    content: inputText, // Pass the formatted task and team data
                },
            ],
            max_tokens: 500,
        });

        // Extract response from Hugging Face API
        const result = chatCompletion.choices[0].message;

        // Send the result back to the frontend
        res.json({ allocation: result });
    } catch (error) {
        console.error('Error with Hugging Face API:', error);
        res.status(500).json({ error: 'Error while interacting with Hugging Face' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
