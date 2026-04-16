import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <AppLayout title="Profile">
      <div className="card section-intro">
        <div>
          <h3>Account Overview</h3>
          <p>Your role and department context for help desk workflows.</p>
        </div>
        <div className="intro-pill">{user?.role || "User"}</div>
      </div>

      <div className="card form-grid">
        <div>
          <label>Name</label>
          <p>{user?.name}</p>
        </div>
        <div>
          <label>Email</label>
          <p>{user?.email}</p>
        </div>
        <div>
          <label>Role</label>
          <p>{user?.role}</p>
        </div>
        <div>
          <label>Department</label>
          <p>{user?.department || "General"}</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
