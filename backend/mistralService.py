from mistral_common.tokens.tokenizers.mistral import MistralTokenizer
from mistral_common.protocol.instruct.messages import UserMessage
from mistral_common.protocol.instruct.request import ChatCompletionRequest
from mistral_inference.transformer import Transformer
from mistral_inference.generate import generate
from transformers import AutoModelForCausalLM

mistral_models_path = "MISTRAL_MODELS_PATH"

# Initialize tokenizer and model
tokenizer = MistralTokenizer.v1()

# Example request
completion_request = ChatCompletionRequest(messages=[UserMessage(content="Explain Machine Learning to me in a nutshell.")])

# Tokenize input
tokens = tokenizer.encode_chat_completion(completion_request).tokens

# Inference using Mistral inference
model = Transformer.from_folder(mistral_models_path)
out_tokens, _ = generate([tokens], model, max_tokens=64, temperature=0.0, eos_id=tokenizer.instruct_tokenizer.tokenizer.eos_id)

result = tokenizer.decode(out_tokens[0])

print(result)

# Inference using Hugging Face transformers
model_hf = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")
model_hf.to("cuda")

generated_ids = model_hf.generate(tokens, max_new_tokens=1000, do_sample=True)

# Decode using Mistral tokenizer
result_hf = tokenizer.decode(generated_ids[0].tolist())
print(result_hf)
