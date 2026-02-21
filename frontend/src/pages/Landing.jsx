import { useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/clerk-react";
import GlowBackground from "../components/ui/GlowBackground.jsx";
import Button from "../components/ui/Button.jsx";
import { useUser } from "@clerk/clerk-react";

export default function Landing() {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  return (
    <>
      {/* LOADING STATE */}
      <ClerkLoading>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            background: "var(--bg-primary)",
            fontSize: "1rem",
            letterSpacing: "0.08em",
          }}
        >
          Initializing career intelligence…
        </div>
      </ClerkLoading>

      {/* LOADED STATE */}
      <ClerkLoaded>
        <div
          style={{
            minHeight: "100vh",
            background: "var(--bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <GlowBackground />

          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              maxWidth: "1000px",
              padding: "0 2rem",
              textAlign: "center",
              transform: "translateY(-3vh)",
            }}
          >
            {/* Top label */}
            <p
              style={{
                color: "var(--accent-blue)",
                letterSpacing: "0.3em",
                fontSize: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              AI • CAREER • FUTURE
            </p>

            {/* Headline */}
            <h1 style={{headlineStyle, animation: "fadeUp 0.6s ease both"}}>
              {isSignedIn ? (
                <>
                Hello,{" "}
                <span style={highlight}>
                  {user?.firstName || "there"}</span>{" "}👋
                <br />
                Ready to future-proof your career?
                </>
              ) : (
                "Future-Proof Your Career"
              )}
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--text-secondary)",
                maxWidth: "680px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Velocity analyzes skill obsolescence, market momentum, and role
              viability to guide you toward careers that actually last.
            </p>

            {/* CTA */}
            <div style={{ marginTop: "2.75rem" }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button>Start Career Analysis →</Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Button onClick={() => navigate("/quiz")}>
                  Continue Career Analysis →
                </Button>
              </SignedIn>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "3.5rem",
                marginTop: "3.5rem",
                flexWrap: "wrap",
              }}
            >
              <Stat number="2.5 yrs" label="Avg Skill Half-Life" />
              <Stat number="3+" label="Market Signals" />
              <Stat number="AI" label="Risk Forecasting" />
            </div>
          </div>
        </div>
      </ClerkLoaded>
    </>
  );
}

/* ===== SMALL COMPONENT ===== */

function Stat({ number, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "1.6rem",
          fontWeight: 700,
          marginBottom: "0.25rem",
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const headlineStyle = {
  fontSize: "3.6rem",
  fontWeight: 800,
  lineHeight: 1.15,
  marginBottom: "1.25rem",
  maxWidth: "900px",
  marginInline: "auto",
};

const highlight = {
  background: "linear-gradient(135deg, #3B82F6, #10B981)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};