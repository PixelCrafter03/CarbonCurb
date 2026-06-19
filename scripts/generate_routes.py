import json
from commute_ai import generate_commute_plan

# Load commute groups
with open("data/green_commute_groups.json", "r") as f:
    groups = json.load(f)

routes = []

for group in groups:

    route = {
        "zip_code": group["zip_code"],
        "students": group["students"],
        "co2_saved": group["co2_saved"]
    }

    route["ai_recommendation"] = generate_commute_plan(route)

    routes.append(route)

# Save routes
with open("data/routes_with_ai.json", "w") as f:
    json.dump(routes, f, indent=4)

print("Generated routes_with_ai.json successfully!")
print(f"Created {len(routes)} routes.")