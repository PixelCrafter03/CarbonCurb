import data from "../../data/carboncurb_clustered.json";

export default function Dashboard() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        CarbonCurb Dashboard
      </h1>

      <div className="grid gap-4">
        {data.slice(0, 20).map((zone: any, index: number) => (
          <div
            key={index}
            className="border p-4 rounded-lg"
          >
            <h2 className="font-bold">
              {zone.location}
            </h2>

            <p>
              CO₂: {Math.round(zone.estimated_co2)}
            </p>

            <p>
              {zone.risk_level === "High" && "🔴 High"}
              {zone.risk_level === "Medium" && "🟡 Medium"}
              {zone.risk_level === "Low" && "🟢 Low"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}