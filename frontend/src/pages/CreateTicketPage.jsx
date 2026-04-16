import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const CreateTicketPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "Laptop",
    title: "",
    description: "",
    priority: "Medium",
    attachment: null,
  });
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      setForm((prev) => ({ ...prev, attachment: files?.[0] || null }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = new FormData();
      data.append("category", form.category);
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("priority", form.priority);
      if (form.attachment) data.append("attachment", form.attachment);

      const ticket = await api.post("/tickets", data, token);
      navigate(`/tickets/${ticket._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AppLayout title="Create Ticket">
      <div className="card section-intro">
        <div>
          <h3>Submit a New Issue</h3>
          <p>Provide clear details so the right technician can pick this up quickly.</p>
        </div>
        <div className="intro-pill">Guided Form</div>
      </div>

      <form className="card form-grid" onSubmit={onSubmit}>
        <h3 className="form-title">Issue Details</h3>
        {error ? <p className="error-text">{error}</p> : null}

        <div>
          <label>Issue Category</label>
          <select name="category" value={form.category} onChange={onChange}>
            {["Laptop", "Printer", "Wi-Fi", "Software", "Login/Password", "Hardware", "Network", "Other"].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={onChange}>
            {["Low", "Medium", "High", "Critical"].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="full-width">
          <label>Issue Title</label>
          <input name="title" value={form.title} onChange={onChange} required />
        </div>

        <div className="full-width">
          <label>Description</label>
          <textarea name="description" rows="5" value={form.description} onChange={onChange} required />
        </div>

        <div className="full-width">
          <label>Attachment (optional)</label>
          <input type="file" name="attachment" accept="image/*,.pdf" onChange={onChange} />
        </div>

        <button className="btn" type="submit">
          Submit Ticket
        </button>
      </form>
    </AppLayout>
  );
};

export default CreateTicketPage;
