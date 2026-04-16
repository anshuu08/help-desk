import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const API_HOST = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

const TicketDetailsPage = () => {
  const { token, user } = useAuth();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [admins, setAdmins] = useState([]);

  const load = async () => {
    const details = await api.get(`/tickets/${id}`, token);
    setData(details);

    if (user.role !== "employee") {
      const users = await api.get("/users?role=technician", token).catch(() => []);
      const adminsData = await api.get("/users?role=admin", token).catch(() => []);
      setAdmins([...(Array.isArray(users) ? users : []), ...(Array.isArray(adminsData) ? adminsData : [])]);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, [id]);

  if (!data) {
    return <AppLayout title="Ticket Details">Loading...</AppLayout>;
  }

  const { ticket, comments } = data;

  const updateTicket = async (payload) => {
    await api.patch(`/tickets/${id}`, payload, token);
    await load();
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await api.post(`/tickets/${id}/comments`, { message }, token);
    setMessage("");
    await load();
  };

  return (
    <AppLayout title="Ticket Details">
      <div className="card section-intro">
        <div>
          <h3>Ticket #{ticket._id.slice(-6).toUpperCase()}</h3>
          <p>Review context, update state, and keep everyone aligned through comments.</p>
        </div>
        <div className="intro-pill">{ticket.status}</div>
      </div>

      <div className="grid-two">
        <div className="card">
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>
          <div className="meta-row">
            <PriorityBadge value={ticket.priority} />
            <StatusBadge value={ticket.status} />
            <span>{ticket.category}</span>
          </div>
          <p>Created by: {ticket.createdBy?.name}</p>
          <p>Assigned to: {ticket.assignedTo?.name || "Unassigned"}</p>

          {ticket.attachment ? (
            <p>
              Attachment: <a href={`${API_HOST}${ticket.attachment}`} target="_blank" rel="noreferrer">View File</a>
            </p>
          ) : null}
        </div>

        {user.role !== "employee" ? (
          <div className="card">
            <h3>Technician Actions</h3>
            <label>Status</label>
            <select defaultValue={ticket.status} onChange={(e) => updateTicket({ status: e.target.value })}>
              {["Open", "In Progress", "Resolved", "Closed"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>

            <label>Priority</label>
            <select defaultValue={ticket.priority} onChange={(e) => updateTicket({ priority: e.target.value })}>
              {["Low", "Medium", "High", "Critical"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>

            <label>Assign To</label>
            <select
              defaultValue={ticket.assignedTo?._id || ""}
              onChange={(e) => updateTicket({ assignedTo: e.target.value || null })}
            >
              <option value="">Unassigned</option>
              {admins.map((adminUser) => (
                <option key={adminUser._id} value={adminUser._id}>
                  {adminUser.name} ({adminUser.role})
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="card">
        <h3>Comments / Updates</h3>
        <div className="comment-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <b>{comment.user?.name}</b>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
              <p>{comment.message}</p>
            </div>
          ))}
        </div>

        <form className="inline-form" onSubmit={submitComment}>
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add comment" />
          <button className="btn" type="submit">
            Send
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default TicketDetailsPage;
