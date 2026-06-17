import pandas as pd
import random

zip_codes = ["75069", "75070", "75071", "75072"]

students = []

for i in range(1, 101):
    students.append({
        "student_id": i,
        "zip_code": random.choice(zip_codes)
    })

df = pd.DataFrame(students)

df.to_csv("data/students.csv", index=False)

print("Generated 100 students!")