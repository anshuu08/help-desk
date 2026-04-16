import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import MiniBarChart from "../components/MiniBarChart";
import EmptyState from "../components/EmptyState";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [dashboard, warrantyAlerts] = await Promise.all([
        api.get("/dashboard/admin", token),
        api.get("/assets/warranty-alerts", token),
      ]);
      setStats(dashboard);
      setAlerts(warrantyAlerts);
    };

    load().catch(() => {});
  }, [token]);

  return (
    <AppLayout title="Admin Dashboard">
      <div className="card section-intro">
        <div>
          <h3>Command Center</h3>
          <p>Monitor ticket health, technician workload, and asset risk signals in real time.</p>
        </div>
        <div className="intro-pill">{stats?.openTickets ?? 0} open</div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Tickets" value={stats?.totalTickets ?? 0} />
        <StatCard label="Open Tickets" value={stats?.openTickets ?? 0} />
        <StatCard label="Resolved" value={stats?.resolvedTickets ?? 0} />
        <StatCard label="High Priority" value={stats?.highPriorityTickets ?? 0} />
        <StatCard label="Total Assets" value={stats?.totalAssets ?? 0} />
      </div>

      <div className="grid-two">
        <MiniBarChart data={stats?.statusBreakdown || []} />

        <div className="card">
          <h3 className="table-title">Warranty Expiry Alerts</h3>
          {alerts.length === 0 ? (
            <EmptyState text="No upcoming warranty expiry in next 30 days" />
          ) : (
            <div className="simple-list">
              {alerts.map((asset) => (
                <div key={asset._id} className="list-item">
                  <span>{asset.assetName}</span>
                  <b>{new Date(asset.warrantyExpiryDate).toLocaleDateString()}</b>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
