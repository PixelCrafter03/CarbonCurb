import ollama

response = ollama.chat(
    model="llama3.1",
    messages=[
        {
            "role": "user",
            "content": "Recommend a green commute plan for 26 students in ZIP 75070."
        }
    ]
)

print(response["message"]["content"])