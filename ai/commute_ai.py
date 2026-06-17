import ollama

def generate_commute_plan(group):

    prompt = f"""
    Analyze this school commute group:

    ZIP: {group['zip_code']}
    Students: {group['students']}
    CO2 Saved: {group['co2_saved']} kg

    Respond in 3 short bullet points:
    - recommendation
    - safety tip
    - environmental impact

    Maximum 60 words.
    """

    response = ollama.chat(
        model="llama3.1",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]