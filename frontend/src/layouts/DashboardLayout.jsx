import { Outlet, NavLink } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";

export default function DashboardLayout() {
  const { user } = useUser();

  return (
    <div style={wrapper}>
      {/* SIDEBAR */}
      <aside style={sidebar}>
        <div>
          {/* PROFILE */}
          <div style={profile}>
            <div style={avatar}>
              {user?.firstName?.[0] || "U"}
            </div>
            <div>
              <div style={name}>{user?.firstName}</div>
              <div style={subtext}>Career Workspace</div>
            </div>
          </div>

          {/* NAV */}
          <nav style={nav}>
            <NavItem to="/dashboard" end>Overview</NavItem>
            <NavItem to="/dashboard/trends">Market Trends</NavItem>
          </nav>
        </div>

        <UserButton afterSignOutUrl="/" />
      </aside>

      {/* CONTENT */}
      <main style={content}>
        <div style={pageContainer}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// function NavItem({ to, children }) {
//   return (
//     <NavLink
//       to={to}
//       style={({ isActive }) => ({
//         padding: "0.85rem 1rem",
//         borderRadius: "12px",
//         fontSize: "0.95rem",
//         fontWeight: isActive ? 600 : 500,
//         color: isActive ? "white" : "#9CA3AF",
//         textDecoration: "none",
//         background: isActive
//           ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(16,185,129,0.18))"
//           : "transparent",
//         border: isActive
//           ? "1px solid rgba(59,130,246,0.5)"
//           : "1px solid transparent",
//         transition: "all 0.25s ease",
//       })}
//     >
//       {children}
//     </NavLink>
//   );
// }

// /* STYLES */

// const wrapper = {
//   display: "flex",
//   minHeight: "100vh",
//   background: "#0b0f19",
//   color: "white",
//   // overflow: "hidden",
// };

// const sidebar = {
//   width: "260px",
//   padding: "2rem 1.5rem",
//   borderRight: "1px solid rgba(255,255,255,0.06)",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "space-between",
//   position: "sticky",
//   top: 0,
//   height: "100vh",
// };

// const profile = {
//   display: "flex",
//   gap: "0.8rem",
//   marginBottom: "2.5rem",
//   alignItems: "center",
// };

// const avatar = {
//   width: "44px",
//   height: "44px",
//   borderRadius: "50%",
//   background: "linear-gradient(135deg,#3B82F6,#10B981)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontWeight: 700,
//   boxShadow: "0 0 0 3px rgba(59,130,246,0.25)",
// };

// const name = { fontWeight: 600 };
// const subtext = { fontSize: "0.8rem", color: "#9CA3AF" };

// const nav = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "0.6rem",
// };

// const content = {
//   flex: 1,
//   padding: "3rem",
// };

// const pageContainer = {
//   maxWidth: "1100px",
//   margin: "0 auto",
// };

function NavItem({ to, children, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        padding: "0.85rem 1rem",
        borderRadius: "12px",
        fontSize: "0.95rem",
        fontWeight: isActive ? 600 : 500,
        color: isActive ? "white" : "#9CA3AF",
        textDecoration: "none",
        background: isActive
          ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(16,185,129,0.18))"
          : "transparent",
        border: isActive
          ? "1px solid rgba(59,130,246,0.5)"
          : "1px solid transparent",
        transition: "all 0.25s ease",
      })}
    >
      {children}
    </NavLink>
  );
}

/* ===== UPDATED DASHBOARD STYLES ===== */

const wrapper = {
  display: "flex",
  minHeight: "100vh",
  background: "radial-gradient(1200px 600px at 20% -10%, rgba(59,130,246,0.15), transparent 60%), #0b0f19",
  color: "white",
  margin: 0,
  padding: 0,
};

const sidebar = {
  width: "260px",
  padding: "2rem 1.5rem",
  borderRight: "1px solid rgba(255,255,255,0.06)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  position: "sticky",
  top: 0,
  height: "100vh",

  background:
    "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(11,15,25,0.95))",
};

const profile = {
  display: "flex",
  gap: "0.9rem",
  marginBottom: "2.5rem",
  alignItems: "center",
};

const avatar = {
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  background: "linear-gradient(135deg,#3B82F6,#10B981)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  boxShadow: "0 0 0 4px rgba(59,130,246,0.15)",
};

const name = { fontWeight: 600, fontSize: "0.95rem" };
const subtext = { fontSize: "0.8rem", color: "#94A3B8" };

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const content = {
  flex: 1,
  padding: "3rem 4rem",
  overflowY: "auto",
  width: "100%",
};

const pageContainer = {
  width: "100%",
  maxWidth: "1280px",
  margin: "0 auto",
};