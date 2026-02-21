export default function Trends() {
  return (
    <>
      <p style={eyebrow}>MARKET SIGNALS</p>
      <h1 style={title}>Where the industry is heading</h1>
      <p style={subtitle}>
        Signals shaping backend engineering roles over the next 3–5 years.
      </p>

      <div style={stack}>
        <TrendCard
          title="Cloud-first is non-negotiable"
          desc="Most backend roles now assume comfort with distributed cloud systems."
          strength="Strong signal"
        />

        <TrendCard
          title="System design is baseline"
          desc="Hiring loops increasingly filter candidates on architectural thinking."
          strength="Very strong signal"
        />

        <TrendCard
          title="AI augments backend engineers"
          desc="AI speeds up delivery, but architectural judgment remains human-led."
          strength="Emerging signal"
        />
      </div>
    </>
  );
}

function TrendCard({ title, desc, strength }) {
  return (
    <div style={card}>
      <div style={strengthTag}>{strength}</div>
      <h3 style={{ marginTop: "0.6rem" }}>{title}</h3>
      <p style={descText}>{desc}</p>
    </div>
  );
}

/* STYLES */

const eyebrow = {
  color: "#3B82F6",
  letterSpacing: "0.25em",
  fontSize: "0.75rem",
};

const title = {
  fontSize: "2.4rem",
  marginTop: "0.8rem",
};

const subtitle = {
  marginTop: "0.6rem",
  color: "#9CA3AF",
  maxWidth: "640px",
};

const stack = {
  marginTop: "3rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.8rem",
};

const card = {
  padding: "2rem",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(59,130,246,0.35)",
};

const strengthTag = {
  display: "inline-block",
  padding: "0.35rem 0.8rem",
  borderRadius: "999px",
  fontSize: "0.75rem",
  background: "rgba(59,130,246,0.18)",
  border: "1px solid rgba(59,130,246,0.5)",
};

const descText = {
  marginTop: "0.6rem",
  color: "#9CA3AF",
};