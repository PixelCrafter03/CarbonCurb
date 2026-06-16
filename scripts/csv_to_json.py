import pandas as pd

df = pd.read_csv("data/carboncurb_clustered.csv")

df.to_json(
    "data/carboncurb_clustered.json",
    orient="records",
    indent=2
)

print("JSON created!")