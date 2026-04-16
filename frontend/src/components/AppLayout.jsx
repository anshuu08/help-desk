import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HelpBotWidget from "./HelpBotWidget";

const linksByRole = {
  employee: [
    { to: "/", label: "Home" },
    { to: "/employee", label: "Dashboard" },
    { to: "/tickets", label: "My Tickets" },
    { to: "/tickets/create", label: "Create Ticket" },
    { to: "/profile", label: "Profile" },
  ],
  admin: [
    { to: "/", label: "Home" },
    { to: "/admin", label: "Dashboard" },
    { to: "/tickets", label: "Tickets" },
    { to: "/assets", label: "Assets" },
    { to: "/users", label: "Users" },
    { to: "/profile", label: "Profile" },
  ],
  technician: [
    { to: "/", label: "Home" },
    { to: "/admin", label: "Dashboard" },
    { to: "/tickets", label: "Tickets" },
    { to: "/assets", label: "Assets" },
    { to: "/profile", label: "Profile" },
  ],
};

const AppLayout = ({ title, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = linksByRole[user.role] || [];
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <div className="bg-ornament one" />
      <div className="bg-ornament two" />

      <aside className="sidebar">
        <div className="brand">IT Help Desk</div>
        <p className="brand-subtitle">Asset + Support Operations</p>
        <nav className="nav-menu">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span>Signed in as</span>
          <strong>{roleLabel}</strong>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar card topbar-card">
          <div>
            <p className="eyebrow">Operations Center</p>
            <h1>{title}</h1>
            <p>Welcome back, {user.name}</p>
          </div>
          <div className="topbar-actions">
            <div className="user-chip">
              <span className="chip-dot" />
              <span>{roleLabel}</span>
            </div>
            <button className="btn secondary" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <section className="content fade-in">{children}</section>
        <HelpBotWidget />
      </main>
    </div>
  );
};

export default AppLayout;
