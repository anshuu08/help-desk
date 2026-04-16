import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const EmployeeDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [dashboard, tickets] = await Promise.all([
        api.get("/dashboard/employee", token),
        api.get("/tickets?status=Open", token),
      ]);
      setStats(dashboard);
      setRecent(tickets.slice(0, 5));
    };
    load().catch(() => {});
  }, [token]);

  return (
    <AppLayout title="Employee Dashboard">
      <div className="card section-intro">
        <div>
          <h3>Support Snapshot</h3>
          <p>Stay updated on your requests and resolve blockers faster with IT support.</p>
        </div>
        <div className="intro-pill">{stats?.openTickets ?? 0} active</div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Tickets" value={stats?.totalTickets ?? 0} />
        <StatCard label="Open" value={stats?.openTickets ?? 0} />
        <StatCard label="In Progress" value={stats?.inProgressTickets ?? 0} />
        <StatCard label="Resolved" value={stats?.resolvedTickets ?? 0} />
      </div>

      <div className="card">
        <div className="section-title">
          <h3>Open Tickets</h3>
          <Link className="btn secondary" to="/tickets/create">
            Create Ticket
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState text="No open tickets" />
        ) : (
          <div className="simple-list">
            {recent.map((ticket) => (
              <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="list-item">
                <span>{ticket.title}</span>
                <StatusBadge value={ticket.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default EmployeeDashboard;
