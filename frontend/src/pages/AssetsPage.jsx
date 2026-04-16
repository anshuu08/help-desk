import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const defaultForm = {
  assetName: "",
  assetType: "Laptop",
  serialNumber: "",
  purchaseDate: "",
  warrantyExpiryDate: "",
  assignedEmployee: "",
  currentStatus: "Available",
  vendorName: "",
  location: "",
};

const AssetsPage = () => {
  const { token, user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [filters, setFilters] = useState({ search: "", assetType: "", currentStatus: "" });

  const isManage = user.role !== "employee";

  const load = async () => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) query.append(k, v);
    });

    const data = await api.get(`/assets${query.toString() ? `?${query.toString()}` : ""}`, token);
    setAssets(data);

    if (isManage) {
      const users = await api.get("/users?role=employee", token).catch(() => []);
      setEmployees(Array.isArray(users) ? users : []);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, [token, filters.search, filters.assetType, filters.currentStatus]);

  const onCreate = async (e) => {
    e.preventDefault();
    await api.post("/assets", form, token);
    setForm(defaultForm);
    await load();
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) return;
    await api.del(`/assets/${id}`, token);
    await load();
  };

  return (
    <AppLayout title="Asset Management">
      <div className="card section-intro">
        <div>
          <h3>Asset Registry</h3>
          <p>Manage lifecycle, assignment, and warranty visibility for all IT equipment.</p>
        </div>
        <div className="intro-pill">{assets.length} assets</div>
      </div>

      <div className="card filter-grid">
        <input placeholder="Search assets" value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} />
        <select value={filters.assetType} onChange={(e) => setFilters((p) => ({ ...p, assetType: e.target.value }))}>
          <option value="">All Types</option>
          {["Laptop", "Desktop", "Router", "Printer", "Monitor", "Keyboard", "Mouse", "Server", "Mobile Device"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select value={filters.currentStatus} onChange={(e) => setFilters((p) => ({ ...p, currentStatus: e.target.value }))}>
          <option value="">All Status</option>
          {["In Use", "Available", "Under Repair", "Retired"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>

      <div className="card table-wrap">
        <h3 className="table-title">Asset List</h3>
        {assets.length === 0 ? (
          <EmptyState text="No assets found" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Serial</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Warranty</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset._id}>
                  <td>{asset.assetName}</td>
                  <td>{asset.assetType}</td>
                  <td>{asset.serialNumber}</td>
                  <td>{asset.currentStatus}</td>
                  <td>{asset.assignedEmployee?.name || "-"}</td>
                  <td>{new Date(asset.warrantyExpiryDate).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/assets/${asset._id}`}>View</Link>
                    {user.role === "admin" ? (
                      <button className="link-btn" type="button" onClick={() => onDelete(asset._id)}>
                        Delete
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isManage ? (
        <form className="card form-grid" onSubmit={onCreate}>
          <h3 className="form-title">Add New Asset</h3>
          <input placeholder="Asset Name" required value={form.assetName} onChange={(e) => setForm((p) => ({ ...p, assetName: e.target.value }))} />
          <select value={form.assetType} onChange={(e) => setForm((p) => ({ ...p, assetType: e.target.value }))}>
            {["Laptop", "Desktop", "Router", "Printer", "Monitor", "Keyboard", "Mouse", "Server", "Mobile Device"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <input placeholder="Serial Number" required value={form.serialNumber} onChange={(e) => setForm((p) => ({ ...p, serialNumber: e.target.value }))} />
          <input type="date" required value={form.purchaseDate} onChange={(e) => setForm((p) => ({ ...p, purchaseDate: e.target.value }))} />
          <input type="date" required value={form.warrantyExpiryDate} onChange={(e) => setForm((p) => ({ ...p, warrantyExpiryDate: e.target.value }))} />
          <select value={form.assignedEmployee} onChange={(e) => setForm((p) => ({ ...p, assignedEmployee: e.target.value }))}>
            <option value="">Assign Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
          <select value={form.currentStatus} onChange={(e) => setForm((p) => ({ ...p, currentStatus: e.target.value }))}>
            {["In Use", "Available", "Under Repair", "Retired"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <input placeholder="Vendor Name" value={form.vendorName} onChange={(e) => setForm((p) => ({ ...p, vendorName: e.target.value }))} />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />

          <button className="btn" type="submit">
            Add Asset
          </button>
        </form>
      ) : null}
    </AppLayout>
  );
};

export default AssetsPage;
