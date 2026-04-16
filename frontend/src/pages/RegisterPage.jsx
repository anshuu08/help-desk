import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/employee", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell fade-in">
        <aside className="auth-side">
          <p className="eyebrow">Employee Onboarding</p>
          <h2>Get support from day one.</h2>
          <p>Create your account to submit and track IT requests across devices and software.</p>
        </aside>

        <form className="card auth-card" onSubmit={onSubmit}>
          <h2>Employee Registration</h2>
          {error ? <p className="error-text">{error}</p> : null}

          <label htmlFor="name">Name</label>
          <input id="name" name="name" required value={form.name} onChange={onChange} />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={onChange} />

          <label htmlFor="department">Department</label>
          <input id="department" name="department" value={form.department} onChange={onChange} />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required value={form.password} onChange={onChange} />

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Register"}
          </button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
