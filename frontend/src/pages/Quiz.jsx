

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
  "Software Engineer",
  "Front End Developer",
  "Back End Developer",
  "Full Stack Developer",
  "Platform Engineer",
  "Cloud Engineer",
  "Cloud Solutions Architect",
  "DevOps Engineer",
  "MLOps Engineer",
  "Data Analyst",
  "Business Intelligence Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "Artificial Intelligence Engineer",
  "Cybersecurity Analyst",
  "Network Security Engineer",
  "UX Designer",
  "Product Manager",
  "Game Developer"
];


export default function Quiz() {
  const navigate = useNavigate(); // ✅ CORRECT PLACE
  

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

  /* ================= STEP 1 ================= */

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

        <div style={{ marginTop: "2rem" }}>
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

  /* ================= STEP 2 ================= */

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
                  ? "linear-gradient(180deg, rgba(59,130,246,0.18), rgba(15,23,42,0.9))"
                  : "#0f172a"
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
          await fetchWithAuth("/api/quiz/submit", {
            method: "POST",
            body: JSON.stringify({
              skills: selectedSkills,
              role: selectedRole,
            }),
          });

          navigate("/dashboard");
        } catch (err) {
          console.error("Quiz submit failed", err);
        }
      }}
      />
    </Page>
  );
}

/* ================= UI COMPONENTS ================= */

function Page({ children, step }) {
  const backgrounds = {
    1: "radial-gradient(1200px 600px at 20% 10%, rgba(59,130,246,0.18), transparent 60%), #0b0f19",
    2: "radial-gradient(1200px 600px at 80% 15%, rgba(99,102,241,0.18), transparent 60%), #0b0f19",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "5rem 4rem",
        color: "white",
        background: backgrounds[step],
        transition: "background 0.6s ease",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {children}
      </div>
    </div>
  );
}

function Header({ step, title, subtitle }) {
  return (
    <div>
      <p style={{ color: "var(--accent-blue)", letterSpacing: "0.2em" }}>
        {step}
      </p>
      <h1 style={{ fontSize: "2.6rem", marginTop: "0.6rem" }}>
        {title}
      </h1>
      <p style={{ color: "var(--text-secondary)", marginTop: "0.6rem" }}>
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
      style={{
        width: "100%",
        maxWidth: "500px",
        marginTop: "2rem",
        padding: "0.9rem 1rem",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "#0f172a",
        color: "white",
        outline: "none"
      }}
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
    <div
      style={{
        marginTop: "5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
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
          opacity: rightDisabled ? 0.5 : 1,
          cursor: rightDisabled ? "not-allowed" : "pointer"
        }}
      >
        {rightLabel}
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

const badgeWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.7rem",
  marginTop: "1rem"
};

const roleGrid = {
  marginTop: "3rem",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "1.4rem"
};

const roleCard = {
  padding: "1.6rem",
  borderRadius: "18px",
  background: "#0f172a",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const primaryBtn = {
  padding: "0.85rem 1.8rem",
  borderRadius: "999px",
  border: "none",
  fontWeight: 600,
  background: "linear-gradient(135deg, #3B82F6, #10B981)",
  color: "#0b0f19"
};

const ghostBtn = {
  background: "transparent",
  color: "white",
  border: "1px solid rgba(255,255,255,0.15)",
  padding: "0.6rem 1.3rem",
  borderRadius: "999px"
};