export default function Trends() {
  return (
    <div>
      <h1 style={title}>Market Trends</h1>
      <p style={subtitle}>
        Demand signals and role evolution insights.
      </p>
    </div>
  );
}

const title = { fontSize: "2.2rem" };
const subtitle = { marginTop: "0.8rem", color: "#9CA3AF" };