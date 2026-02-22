import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Trends() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/trends")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading market signals…</p>;

  const growing = data.top_growing_skills.slice(0, 5).map((s) => ({
    name: s.skill,
    risk: +(s.decline_risk_probability * 100).toFixed(1),
  }));

  const declining = data.top_declining_skills.slice(0, 5).map((s) => ({
    name: s.skill,
    risk: +(s.decline_risk_probability * 100).toFixed(1),
  }));

  return (
    <div style={{ width: "100%" , display: "flex", flexDirection: 
      "column", gap: "3.5rem"
    }}>
      <p style={eyebrow}>MARKET SIGNALS</p>

      <h1 style={title}>Industry Momentum</h1>

      {/* Market Stability */}
      <div style={{ ...card, width: "100%" }}>
        <h3>Market Stability Index</h3>
        <div style={indexNumber}>
          {(data.market_stability_index * 100).toFixed(2)}%
        </div>
        <p style={muted}>
          Overall resilience of the current skill ecosystem
        </p>
      </div>

      {/* Growing Skills */}
      <div style={{ marginTop: "3rem", width: "100%" }}>
        <h3>Top Growing Skills</h3>

        <div style={{ ...card, width: "100%" }}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={growing}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
                angle={-30}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                }}
              />
              <Bar dataKey="risk" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* High Risk Skills */}
      <div style={{ marginTop: "3rem", width: "100%" }}>
        <h3>High Risk Skills</h3>

        <div style={{ ...card, width: "100%" }}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={declining}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
                angle={-30}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                }}
              />
              <Bar dataKey="risk" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

// const eyebrow = {
//   color: "#3B82F6",
//   letterSpacing: "0.25em",
//   fontSize: "0.75rem",
// };

// const title = {
//   fontSize: "2.6rem",
//   marginTop: "0.8rem",
// };

// const card = {
//   marginTop: "1.5rem",
//   padding: "2.2rem",
//   borderRadius: "22px",
//   background:
//     "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
//   border: "1px solid rgba(255,255,255,0.12)",
//   boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
// };

// const indexNumber = {
//   fontSize: "2.4rem",
//   fontWeight: 700,
//   marginTop: "0.6rem",
// };

// const muted = {
//   marginTop: "0.4rem",
//   color: "#9CA3AF",
// };


/* ===== UPDATED TRENDS STYLES ===== */

const eyebrow = {
  color: "#3B82F6",
  letterSpacing: "0.2em",
  fontSize: "0.75rem",
  marginBottom: "0.6rem",
};

const title = {
  fontSize: "2.8rem",
  marginTop: "0.3rem",
};

const card = {
  padding: "2.4rem",
  borderRadius: "20px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(6px)",
  boxShadow: "0 25px 70px rgba(0,0,0,0.45)",
};

const indexNumber = {
  fontSize: "2.8rem",
  fontWeight: 700,
  marginTop: "0.8rem",
  background: "linear-gradient(135deg,#3B82F6,#10B981)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const muted = {
  marginTop: "0.6rem",
  color: "#94A3B8",
};