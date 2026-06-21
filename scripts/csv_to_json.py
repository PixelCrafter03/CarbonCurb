import pandas as pd
import json

df = pd.read_csv("carboncurb_clustered.csv")

df.to_json(
    "public/clusters.json",
    orient="records",
    indent=2
)

print("Created clusters.json")