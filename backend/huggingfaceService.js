import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config(); // Load environment variables from .env file

const HF_TOKEN = process.env.HF_TOKEN;
if (!HF_TOKEN) {
    throw new Error("Hugging Face token is missing! Add it to .env file.");
}

export async function queryMistral(input) {
    const model = "mistralai/Mistral-7B-Instruct-v0.1"; // Model you want to use

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: input }),
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
}

// Example usage
const input = "What is the capital of France?";
queryMistral(input).then(response => {
    console.log("Model response:", response);
}).catch(error => {
    console.error("Error:", error.message);
});
