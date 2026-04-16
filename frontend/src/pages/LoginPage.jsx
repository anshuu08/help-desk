import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", roleType: "employee" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form);
      const fallback = user.role === "employee" ? "/employee" : "/admin";
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell fade-in">
        <aside className="auth-side">
          <p className="eyebrow">IT Help Desk</p>
          <h2>Keep your team moving, not waiting.</h2>
          <p>Track incidents, assets, and technician updates in one unified workspace.</p>
        </aside>

        <form className="card auth-card" onSubmit={onSubmit}>
          <h2>Login</h2>
          {error ? <p className="error-text">{error}</p> : null}

          <label htmlFor="roleType">Login Type</label>
          <select id="roleType" name="roleType" value={form.roleType} onChange={onChange}>
            <option value="employee">Employee</option>
            <option value="admin">Admin / Technician</option>
          </select>

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={onChange} />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required value={form.password} onChange={onChange} />

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>

          <p>
            New employee? <Link to="/register">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
