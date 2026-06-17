import pandas as pd
import json

# Load student data
df = pd.read_csv("data/students.csv")

# Group students by ZIP code
groups = df.groupby("zip_code")

results = []

for zip_code, students in groups:

    num_students = len(students)

    # Simple CO₂ estimate
    co2_saved = round(num_students * 2.5, 1)

    results.append({
        "zip_code": str(zip_code),
        "students": num_students,
        "co2_saved": co2_saved
    })

# Save JSON
with open("data/green_commute_groups.json", "w") as f:
    json.dump(results, f, indent=2)

print("Green commute groups created!\n")

for group in results:
    print(group)