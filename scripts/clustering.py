import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# -------------------------
# Generate Synthetic Dataset
# -------------------------

np.random.seed(42)

rows = 500

data = {
    "location": [f"Zone_{i}" for i in range(rows)],
    "population": np.random.randint(2000, 50000, rows),
    "vehicle_count": np.random.randint(500, 20000, rows),
    "industrial_activity": np.random.randint(1, 11, rows),
    "energy_usage_mwh": np.random.randint(200, 10000, rows),
    "green_space_pct": np.random.randint(1, 60, rows)
}

df = pd.DataFrame(data)

# Carbon emissions formula
df["estimated_co2"] = (
    df["vehicle_count"] * 0.08 +
    df["industrial_activity"] * 45 +
    df["energy_usage_mwh"] * 0.12 -
    df["green_space_pct"] * 3
)

# Save raw dataset
df.to_csv("carboncurb_dataset.csv", index=False)

print("Dataset generated!")

# -------------------------
# Clustering
# -------------------------

features = [
    "vehicle_count",
    "industrial_activity",
    "energy_usage_mwh",
    "green_space_pct",
    "estimated_co2"
]

X = df[features]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

kmeans = KMeans(
    n_clusters=3,
    random_state=42,
    n_init=10
)

df["cluster"] = kmeans.fit_predict(X_scaled)

# -------------------------
# Risk Labels
# -------------------------

cluster_means = (
    df.groupby("cluster")["estimated_co2"]
      .mean()
      .sort_values()
)

mapping = {
    cluster_means.index[0]: "Low",
    cluster_means.index[1]: "Medium",
    cluster_means.index[2]: "High"
}

df["risk_level"] = df["cluster"].map(mapping)

# Save final output
df.to_csv("carboncurb_clustered.csv", index=False)

print("\nClustering complete!")
print(df[["location", "estimated_co2", "risk_level"]].head())