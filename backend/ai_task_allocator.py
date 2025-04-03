from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load Mistral 7B model & tokenizer
model_name = "mistralai/Mistral-7B-Instruct-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")

@app.route('/allocate-task', methods=['POST'])
def allocate_task():
    data = request.json  # Get tasks and members from frontend

    # Create prompt dynamically
    tasks = "\n".join([f"{i+1}. {task}" for i, task in enumerate(data["tasks"])])
    members = "\n".join([f"- {member['name']} ({member['skills']})" for member in data["team_members"]])
    
    prompt = f"Given the following tasks and team members, assign tasks based on skills and availability:\n\nTasks:\n{tasks}\n\nTeam Members:\n{members}\n\nTask Assignments:"

    # Tokenize input
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

    # Generate response
    output = model.generate(**inputs, max_new_tokens=200)
    result = tokenizer.decode(output[0], skip_special_tokens=True)

    return jsonify({"allocation": result})  # Return JSON response

if __name__ == '__main__':
    app.run(port=5001)  # Run AI service on port 5001
