import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import EmptyState from "../components/EmptyState";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const TicketsPage = () => {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", priority: "", status: "" });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    const load = async () => {
      const data = await api.get(`/tickets${query ? `?${query}` : ""}`, token);
      setTickets(data);
    };
    load().catch(() => {});
  }, [token, query]);

  return (
    <AppLayout title={user.role === "employee" ? "My Tickets" : "Ticket Management"}>
      <div className="card section-intro">
        <div>
          <h3>Ticket Operations</h3>
          <p>Track, filter, and review every support request from one place.</p>
        </div>
        <div className="intro-pill">{tickets.length} records</div>
      </div>

      <div className="card filter-grid">
        <input
          placeholder="Search title/description"
          value={filters.search}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
        />
        <select value={filters.category} onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}>
          <option value="">All Categories</option>
          {["Laptop", "Printer", "Wi-Fi", "Software", "Login/Password", "Hardware", "Network", "Other"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <select value={filters.priority} onChange={(e) => setFilters((p) => ({ ...p, priority: e.target.value }))}>
          <option value="">All Priorities</option>
          {["Low", "Medium", "High", "Critical"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
          <option value="">All Status</option>
          {["Open", "In Progress", "Resolved", "Closed"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>

      <div className="card table-wrap">
        <div className="section-title">
          <h3>Ticket List</h3>
          {user.role === "employee" ? (
            <Link className="btn secondary" to="/tickets/create">
              New Ticket
            </Link>
          ) : null}
        </div>
        {tickets.length === 0 ? (
          <EmptyState text="No tickets found" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.category}</td>
                  <td>
                    <PriorityBadge value={ticket.priority} />
                  </td>
                  <td>
                    <StatusBadge value={ticket.status} />
                  </td>
                  <td>{ticket.assignedTo?.name || "Unassigned"}</td>
                  <td>{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/tickets/${ticket._id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  );
};

export default TicketsPage;
