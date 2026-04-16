import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const AssetDetailsPage = () => {
  const { token, user } = useAuth();
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [repair, setRepair] = useState({ issue: "", action: "", cost: 0, note: "" });

  const load = async () => {
    const data = await api.get(`/assets/${id}`, token);
    setAsset(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, [id]);

  if (!asset) {
    return <AppLayout title="Asset Details">Loading...</AppLayout>;
  }

  const addRepair = async (e) => {
    e.preventDefault();
    await api.post(`/assets/${id}/repair-logs`, repair, token);
    setRepair({ issue: "", action: "", cost: 0, note: "" });
    await load();
  };

  return (
    <AppLayout title="Asset Details">
      <div className="card section-intro">
        <div>
          <h3>{asset.assetName}</h3>
          <p>Track condition, ownership, and repair events for this asset.</p>
        </div>
        <div className="intro-pill">{asset.currentStatus}</div>
      </div>

      <div className="card form-grid">
        <div>
          <label>Name</label>
          <p>{asset.assetName}</p>
        </div>
        <div>
          <label>Type</label>
          <p>{asset.assetType}</p>
        </div>
        <div>
          <label>Serial Number</label>
          <p>{asset.serialNumber}</p>
        </div>
        <div>
          <label>Status</label>
          <p>{asset.currentStatus}</p>
        </div>
        <div>
          <label>Assigned Employee</label>
          <p>{asset.assignedEmployee?.name || "-"}</p>
        </div>
        <div>
          <label>Warranty Expiry</label>
          <p>{new Date(asset.warrantyExpiryDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="card">
        <h3>Repair History</h3>
        <div className="comment-list">
          {asset.repairHistory.length === 0 ? <p>No repair logs.</p> : null}
          {asset.repairHistory.map((log) => (
            <div key={log._id} className="comment-item">
              <b>{new Date(log.date).toLocaleDateString()} - {log.technician || "Technician"}</b>
              <p>Issue: {log.issue}</p>
              <p>Action: {log.action}</p>
              <p>Cost: {log.cost}</p>
              {log.note ? <p>Note: {log.note}</p> : null}
            </div>
          ))}
        </div>
      </div>

      {user.role !== "employee" ? (
        <form className="card form-grid" onSubmit={addRepair}>
          <h3 className="form-title">Add Repair Log</h3>
          <input required placeholder="Issue" value={repair.issue} onChange={(e) => setRepair((p) => ({ ...p, issue: e.target.value }))} />
          <input required placeholder="Action Taken" value={repair.action} onChange={(e) => setRepair((p) => ({ ...p, action: e.target.value }))} />
          <input type="number" placeholder="Cost" value={repair.cost} onChange={(e) => setRepair((p) => ({ ...p, cost: Number(e.target.value) }))} />
          <textarea placeholder="Note" value={repair.note} onChange={(e) => setRepair((p) => ({ ...p, note: e.target.value }))} />
          <button className="btn" type="submit">
            Add Log
          </button>
        </form>
      ) : null}
    </AppLayout>
  );
};

export default AssetDetailsPage;
