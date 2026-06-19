def generate_commute_plan(route):

    students = route["students"]
    co2 = route["co2_saved"]

    if students > 20:
        recommendation = "Create supervised walking groups with designated student leaders."
    else:
        recommendation = "Encourage walking pairs and neighborhood meet-up points."

    return f"""
• {recommendation}
• Use marked crossings and stay on approved routes.
• This route could save approximately {co2} kg of CO₂ emissions.
"""