import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const dashboardPath =
    user?.role === "employee" ? "/employee" : user?.role ? "/admin" : "/login";

  return (
    <div className="landing-page">
      <div className="landing-glow one" />
      <div className="landing-glow two" />

      <header className="landing-nav">
        <h1>IT Help Desk</h1>
        <div className="landing-actions">
          {isAuthenticated ? (
            <Link className="btn secondary" to={dashboardPath}>
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link className="btn secondary" to="/login">
                Login
              </Link>
              <Link className="btn" to="/register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="landing-hero card fade-in">
        <p className="eyebrow">Unified IT Operations</p>
        <h2>Resolve issues faster and manage assets with confidence.</h2>
        <p>
          One workspace for tickets, technician collaboration, user management, and asset lifecycle tracking.
        </p>

        <div className="landing-cta-row">
          <Link className="btn" to={dashboardPath}>
            Go to Dashboard
          </Link>
          <Link className="btn secondary" to={isAuthenticated ? "/tickets" : "/login"}>
            View Tickets
          </Link>
          <Link className="btn secondary" to={isAuthenticated ? "/profile" : "/login"}>
            Profile
          </Link>
          <Link className="btn secondary" to={isAuthenticated ? "/assets" : "/login"}>
            Asset Management
          </Link>
        </div>

        <div className="landing-stats">
          <article className="landing-stat-card">
            <strong>24x7</strong>
            <span>Support Visibility</span>
          </article>
          <article className="landing-stat-card">
            <strong>4-Step</strong>
            <span>Ticket Lifecycle</span>
          </article>
          <article className="landing-stat-card">
            <strong>Role-Based</strong>
            <span>Secure Access Control</span>
          </article>
        </div>
      </main>

      <section className="landing-grid">
        <article className="card landing-feature card-pop">
          <h3>Smart Ticketing</h3>
          <p>Raise, assign, prioritize, and track issues from open to closure with clean status flow.</p>
        </article>

        <article className="card landing-feature card-pop">
          <h3>Asset Lifecycle</h3>
          <p>Manage inventory, warranty alerts, assignment history, and repair logs in one place.</p>
        </article>

        <article className="card landing-feature card-pop">
          <h3>Team Visibility</h3>
          <p>Role-based dashboards for employees, technicians, and admins with focused insights.</p>
        </article>
      </section>

      <section className="landing-block quick-block">
        <div className="landing-block-head">
          <h3>Quick Access</h3>
          <p>Jump directly to your most-used screens.</p>
        </div>
        <div className="landing-quick-grid">
          <Link className="card quick-card" to={dashboardPath}>
            <h4>Dashboard</h4>
            <p>See current workload, trends, and priority alerts.</p>
          </Link>
          <Link className="card quick-card" to={isAuthenticated ? "/tickets" : "/login"}>
            <h4>Tickets</h4>
            <p>Review requests, status, and technician comments.</p>
          </Link>
          <Link className="card quick-card" to={isAuthenticated ? "/tickets/create" : "/login"}>
            <h4>Create Ticket</h4>
            <p>Log a new issue with category, priority, and attachment.</p>
          </Link>
          <Link className="card quick-card" to={isAuthenticated ? "/profile" : "/login"}>
            <h4>Profile</h4>
            <p>Manage your account view and role information.</p>
          </Link>
        </div>
      </section>

      <section className="landing-block flow-block">
        <div className="landing-block-head">
          <h3>Support Flow Chart</h3>
          <p>How requests move from issue reporting to insights.</p>
        </div>
        <div className="landing-process">
          <article className="card process-card slide-up">
            <span>01</span>
            <h4>Report</h4>
            <p>Employees raise structured tickets with priority and category.</p>
          </article>
          <article className="card process-card slide-up">
            <span>02</span>
            <h4>Assign</h4>
            <p>Admins route requests to the right technician with clear ownership.</p>
          </article>
          <article className="card process-card slide-up">
            <span>03</span>
            <h4>Resolve</h4>
            <p>Technicians update status, add notes, and close issues with context.</p>
          </article>
          <article className="card process-card slide-up">
            <span>04</span>
            <h4>Analyze</h4>
            <p>Dashboards and alerts reveal bottlenecks and asset risk patterns.</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
