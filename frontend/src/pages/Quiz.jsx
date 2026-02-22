import { useAuth } from "@clerk/clerk-react";
import { fetchWithAuth } from "../services/api";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

/* ================= SKILL TAXONOMY ================= */

const SKILLS = {
  "Core Programming": ["Python","JavaScript","TypeScript","Java","C++","Go","SQL"],
  "Frontend Development": ["HTML","CSS","React","Angular","Next.js"],
  "Backend Development": ["Node.js","Express.js","Django","Spring Boot","REST"],
  Databases: ["PostgreSQL","MySQL","MongoDB","Redis"],
  "DevOps & Cloud": ["Docker","Kubernetes","Amazon Web Services","Microsoft Azure","CI/CD","Terraform","Linux"],
  "Data & Analytics": ["Pandas","NumPy","Power BI","Tableau","Excel","Statistics"],
  "Machine Learning & AI": ["scikit-learn","TensorFlow","PyTorch","Deep Learning","NLP","XGBoost","Feature Engineering"],
  MLOps: ["MLFlow","Model Deployment","Data Versioning"],
  "Cyber Security": ["Network Security","Ethical Hacking","Cryptography","OWASP"],
  "Software Architecture": ["System Design","Microservices","Distributed Systems","API Design"],
  "UX Design": ["Figma","User Research","Prototyping"],
  "Game Development": ["Unity","Unreal Engine"],
  "Product & Process": ["Agile","A/B Testing"]
};

const ROLES = [
  "Software Engineer","Front End Developer","Back End Developer",
  "Full Stack Developer","Platform Engineer","Cloud Engineer",
  "Cloud Solutions Architect","DevOps Engineer","MLOps Engineer",
  "Data Analyst","Business Intelligence Analyst","Data Scientist",
  "Machine Learning Engineer","Artificial Intelligence Engineer",
  "Cybersecurity Analyst","Network Security Engineer","UX Designer",
  "Product Manager","Game Developer"
];

export default function Quiz() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [skillSearch, setSkillSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const filteredSkills = useMemo(() => {
    return Object.entries(SKILLS).reduce((acc, [category, skills]) => {
      const filtered = skills.filter(skill =>
        skill.toLowerCase().includes(skillSearch.toLowerCase())
      );
      if (filtered.length) acc[category] = filtered;
      return acc;
    }, {});
  }, [skillSearch]);

  const filteredRoles = ROLES.filter(role =>
    role.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  if (step === 1) {
    return (
      <Page step={1}>
        <Header
          step="STEP 1 OF 2"
          title="Select your skill set"
          subtitle="Choose the skills you are confident using in real projects."
        />

        <SearchInput
          value={skillSearch}
          onChange={setSkillSearch}
          placeholder="Search skills..."
        />

        <div style={{ marginTop: "2.5rem" }}>
          {Object.entries(filteredSkills).map(([category, skills]) => (
            <Card key={category} title={category}>
              <div style={badgeWrap}>
                {skills.map(skill => (
                  <Badge
                    key={skill}
                    label={skill}
                    selected={selectedSkills.includes(skill)}
                    onClick={() => toggleSkill(skill)}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Footer
          leftText={`${selectedSkills.length} skills selected`}
          rightDisabled={!selectedSkills.length}
          rightLabel="Next →"
          onRight={() => setStep(2)}
        />
      </Page>
    );
  }

  return (
    <Page step={2}>
      <Header
        step="STEP 2 OF 2"
        title="Choose your future role"
        subtitle="Select the role you aspire to grow into."
      />

      <SearchInput
        value={roleSearch}
        onChange={setRoleSearch}
        placeholder="Search roles..."
      />

      <div style={roleGrid}>
        {filteredRoles.map(role => (
          <div
            key={role}
            onClick={() => setSelectedRole(role)}
            style={{
              ...roleCard,
              border:
                selectedRole === role
                  ? "1.5px solid #3B82F6"
                  : "1px solid rgba(255,255,255,0.08)",
              background:
                selectedRole === role
                  ? "linear-gradient(180deg, rgba(59,130,246,0.22), rgba(11,15,25,0.95))"
                  : "rgba(15,23,42,0.75)"
            }}
          >
            {role}
          </div>
        ))}
      </div>

      <Footer
        leftLabel="← Back"
        onLeft={() => setStep(1)}
        rightDisabled={!selectedRole}
        rightLabel="Finish →"
        onRight={async () => {
          try {
            console.log("Submitting quiz with:", {
              skills: selectedSkills,
              role: selectedRole,
            });
            
            const response = await fetchWithAuth("/api/quiz/submit", {
              method: "POST",
              body: JSON.stringify({
                skills: selectedSkills,
                role: selectedRole,
              }),
            });
            
            console.log("Quiz response:", response);
            
            if (response.message && response.message.includes("failed")) {
              alert("Quiz submission failed: " + response.message);
              return;
            }
            
            navigate("/dashboard");
          } catch (err) {
            console.error("Quiz submit failed", err);
            alert("Error submitting quiz. Check console for details.");
          }
        }}
      />
    </Page>
  );
}

/* ================= UI COMPONENTS ================= */

function Page({ children, step }) {
  const backgrounds = {
    1: `
      radial-gradient(1400px 800px at 20% -10%, rgba(59,130,246,0.25), transparent 70%),
      radial-gradient(1000px 700px at 80% 110%, rgba(16,185,129,0.18), transparent 70%),
      #0b0f19
    `,
    2: `
      radial-gradient(1400px 800px at 80% -10%, rgba(99,102,241,0.28), transparent 70%),
      radial-gradient(1000px 700px at 20% 110%, rgba(59,130,246,0.18), transparent 70%),
      #0b0f19
    `,
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: "100vh",
        padding: "4rem 2rem 6rem",
        background: backgrounds[step],
        display: "flex",
        justifyContent: "center",
        transition: "background 0.6s ease",
      }}
    >
      <div style={pageContainer}>
        {children}
      </div>
    </div>
  );
}

function Header({ step, title, subtitle }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <p style={{ color: "var(--accent-blue)", letterSpacing: "0.25em", fontSize: "0.7rem" }}>
        {step}
      </p>
      <h1 style={{ fontSize: "2.4rem", marginTop: "0.75rem", fontWeight: 800 }}>
        {title}
      </h1>
      <p style={{ color: "var(--text-secondary)", marginTop: "0.6rem", maxWidth: "600px" }}>
        {subtitle}
      </p>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={searchInput}
    />
  );
}

function Footer({
  leftText,
  leftLabel,
  onLeft,
  rightLabel,
  onRight,
  rightDisabled
}) {
  return (
    <div style={footer}>
      {leftLabel ? (
        <button style={ghostBtn} onClick={onLeft}>
          {leftLabel}
        </button>
      ) : (
        <p style={{ color: "var(--text-secondary)" }}>{leftText}</p>
      )}

      <button
        disabled={rightDisabled}
        onClick={onRight}
        style={{
          ...primaryBtn,
          opacity: rightDisabled ? 0.45 : 1,
          cursor: rightDisabled ? "not-allowed" : "pointer"
        }}
      >
        {rightLabel}
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

const pageContainer = {
  width: "100%",
  maxWidth: "1100px",
};

const badgeWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.7rem",
  marginTop: "1rem"
};

const roleGrid = {
  marginTop: "3rem",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "1.4rem"
};

const roleCard = {
  padding: "1.6rem",
  borderRadius: "18px",
  cursor: "pointer",
  transition: "all 0.25s ease",
  backdropFilter: "blur(6px)",
};

const searchInput = {
  width: "100%",
  maxWidth: "520px",
  marginTop: "1.8rem",
  padding: "0.95rem 1.1rem",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(15,23,42,0.8)",
  color: "white",
  outline: "none",
};

const footer = {
  marginTop: "5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const primaryBtn = {
  padding: "0.9rem 2rem",
  borderRadius: "999px",
  border: "none",
  fontWeight: 600,
  background: "linear-gradient(135deg, #3B82F6, #10B981)",
  color: "#0b0f19",
};

const ghostBtn = {
  background: "transparent",
  color: "white",
  border: "1px solid rgba(255,255,255,0.18)",
  padding: "0.6rem 1.4rem",
  borderRadius: "999px",
};