
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/api";

export default function Overview() {
  const [data, setData] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      const result = await fetchWithAuth("/api/users/me", token);
      setData(result);
    };

    load().catch(console.error);
  }, [getToken]);

  if (!data) return <p>Loading snapshot…</p>;

  const { readiness, role } = data;

  const resilienceLabel =
    readiness >= 75
      ? "highly resilient"
      : readiness >= 50
      ? "moderately resilient"
      : "at risk";

  return (
    <>
      <p style={eyebrow}>CAREER SNAPSHOT</p>
      <h1 style={title}>
        Keerat, your career path is{" "}
        <span style={highlight}>{resilienceLabel}</span>
      </h1>
      <p style={subtitle}>
        Based on your skills and current market signals for{" "}
        <strong>{role}</strong>
      </p>

      <div style={grid}>
        <div style={card}>
          <h3>Career Readiness</h3>
          <div style={ring}>{readiness}%</div>
          <p style={muted}>You outperform 62% of peers</p>
        </div>

        <div style={card}>
          <h3>What’s working in your favor</h3>
          <Pill title="Docker" desc="Production-ready containerization" />
          <Pill title="PostgreSQL" desc="Strong relational modeling" />
          <Pill title="REST APIs" desc="Backend integration standard" />
        </div>
      </div>

      <div style={{ marginTop: "3.5rem" }}>
        <h3>What’s holding you back</h3>
        <Weak title="System Design" />
        <Weak title="Cloud Architecture" />
        <Weak title="Distributed Systems" />
      </div>

      <div style={ctaWrap}>
        <button style={cta}>
          Strengthen your weakest career pillar →
        </button>
      </div>
    </>
  );
}

function Pill({ title, desc }) {
  return (
    <div style={pill}>
      <strong>{title}</strong>
      <div style={muted}>{desc}</div>
    </div>
  );
}

function Weak({ title }) {
  return <div style={weak}>{title}</div>;
}

/* STYLES */

const eyebrow = {
  color: "#3B82F6",
  letterSpacing: "0.25em",
  fontSize: "0.75rem",
};

const title = {
  fontSize: "2.6rem",
  marginTop: "0.8rem",
};

const highlight = {
  background: "linear-gradient(135deg,#3B82F6,#10B981)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const subtitle = {
  marginTop: "0.8rem",
  color: "#9CA3AF",
};

const grid = {
  marginTop: "3rem",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "2rem",
};

const card = {
  padding: "2rem",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const ring = {
  marginTop: "1rem",
  fontSize: "2.2rem",
  fontWeight: 700,
};

const muted = {
  marginTop: "0.4rem",
  color: "#9CA3AF",
};

const pill = {
  marginTop: "1rem",
  padding: "0.8rem",
  borderRadius: "14px",
  border: "1px solid rgba(16,185,129,0.5)",
};

const weak = {
  marginTop: "1rem",
  padding: "1rem",
  borderRadius: "14px",
  border: "1px solid rgba(245,158,11,0.5)",
};

const ctaWrap = {
  marginTop: "4rem",
  display: "flex",
  justifyContent: "center",
};

const cta = {
  padding: "0.9rem 2.4rem",
  borderRadius: "999px",
  fontWeight: 600,
  background: "linear-gradient(135deg,#3B82F6,#10B981)",
  border: "none",
  cursor: "pointer",
};