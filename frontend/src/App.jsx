import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import AssetsPage from "./pages/AssetsPage";
import AssetDetailsPage from "./pages/AssetDetailsPage";
import UserManagementPage from "./pages/UserManagementPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route
      path="/employee"
      element={
        <ProtectedRoute roles={["employee"]}>
          <EmployeeDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin"
      element={
        <ProtectedRoute roles={["admin", "technician"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/tickets"
      element={
        <ProtectedRoute roles={["employee", "admin", "technician"]}>
          <TicketsPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/tickets/create"
      element={
        <ProtectedRoute roles={["employee", "admin", "technician"]}>
          <CreateTicketPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/tickets/:id"
      element={
        <ProtectedRoute roles={["employee", "admin", "technician"]}>
          <TicketDetailsPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/assets"
      element={
        <ProtectedRoute roles={["employee", "admin", "technician"]}>
          <AssetsPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/assets/:id"
      element={
        <ProtectedRoute roles={["employee", "admin", "technician"]}>
          <AssetDetailsPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/users"
      element={
        <ProtectedRoute roles={["admin"]}>
          <UserManagementPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <ProtectedRoute roles={["employee", "admin", "technician"]}>
          <ProfilePage />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
