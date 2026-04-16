import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const newUserForm = {
  name: "",
  email: "",
  password: "",
  department: "IT",
  role: "technician",
};

const UserManagementPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(newUserForm);

  const load = async () => {
    const data = await api.get("/users", token);
    setUsers(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, [token]);

  const addUser = async (e) => {
    e.preventDefault();
    await api.post("/users", form, token);
    setForm(newUserForm);
    await load();
  };

  const updateUser = async (id, payload) => {
    await api.patch(`/users/${id}`, payload, token);
    await load();
  };

  return (
    <AppLayout title="User Management">
      <div className="card section-intro">
        <div>
          <h3>People & Access</h3>
          <p>Control technician/admin access and account activation from one admin console.</p>
        </div>
        <div className="intro-pill">{users.length} users</div>
      </div>

      <form className="card form-grid" onSubmit={addUser}>
        <h3 className="form-title">Add Technician/Admin</h3>
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        <input placeholder="Department" value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} />
        <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
          <option value="technician">Technician</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn" type="submit">
          Add User
        </button>
      </form>

      <div className="card table-wrap">
        <h3 className="table-title">User Directory</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.department}</td>
                <td>{u.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button className="link-btn" type="button" onClick={() => updateUser(u._id, { isActive: !u.isActive })}>
                    {u.isActive ? "Disable" : "Enable"}
                  </button>
                  <button className="link-btn" type="button" onClick={() => updateUser(u._id, { role: u.role === "employee" ? "technician" : "employee" })}>
                    Toggle Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default UserManagementPage;
