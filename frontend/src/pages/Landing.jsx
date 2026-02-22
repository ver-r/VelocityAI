import logo from "../assets/logo.svg";
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
            flex: 1,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
            letterSpacing: "0.12em",
            color: "var(--text-secondary)",
          }}
        >
          Initializing career intelligence…
        </div>
      </ClerkLoading>

      {/* LOADED STATE */}
      <ClerkLoaded>
        <div
          style={{
            flex: 1,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "4rem 2rem",
          }}
        >
          <GlowBackground />



          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              maxWidth: "1100px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {/* Logo */}
            <img
              src={logo}
                alt="Velocity Logo"
                style={{
                width: "70px",
                marginBottom: "1.5rem",
                opacity: 0.95,
              }}
            />
            
            {/* Top Label */}
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.4em",
                color: "var(--accent-blue)",
                marginBottom: "2rem",
                opacity: 0.9,
              }}
            >
              AI • CAREER • FUTURE
            </p>

            {/* Headline */}
            <h1 style={headlineStyle}>
              {isSignedIn ? (
                <>
                  Hello{" "}
                  <span style={highlight}>
                    {user?.firstName || "there"}
                  </span>{" "}
                  👋
                  <br />
                  Ready to future-proof your career?
                </>
              ) : (
                "Future-Proof Your Career"
              )}
            </h1>

            {/* Subtext */}
            <p style={subTextStyle}>
              Velocity analyzes skill obsolescence, market momentum, and role
              viability to guide you toward careers that actually last.
            </p>

            {/* CTA */}
            <div style={{ marginTop: "3rem" }}>
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
            <div style={statsWrapper}>
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
    <div style={statCard}>
      <div style={statNumber}>{number}</div>
      <div style={statLabel}>{label}</div>
    </div>
  );
}

/* ===== STYLES ===== */

const headlineStyle = {
  fontSize: "clamp(2.5rem, 6vw, 4.8rem)",
  fontWeight: 900,
  lineHeight: 1.05,
  letterSpacing: "-0.03em",
  maxWidth: "900px",
  margin: "0 auto 1.75rem auto",
};

const subTextStyle = {
  fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
  color: "var(--text-secondary)",
  maxWidth: "700px",
  margin: "0 auto",
  lineHeight: 1.7,
};

const highlight = {
  background: "linear-gradient(135deg, #3B82F6, #10B981)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const statsWrapper = {
  marginTop: "4rem",
  display: "flex",
  justifyContent: "center",
  gap: "4rem",
  flexWrap: "wrap",
};

const statCard = {
  textAlign: "center",
  minWidth: "140px",
};

const statNumber = {
  fontSize: "2.25rem",
  fontWeight: 800,
  marginBottom: "0.35rem",
  letterSpacing: "-0.02em",
};

const statLabel = {
  fontSize: "0.9rem",
  color: "var(--text-secondary)",
  letterSpacing: "0.02em",
};