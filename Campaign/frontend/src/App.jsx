
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";

import MainDashboardLayout from "./layout/MainDashboardLayout";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import AddAudio from "./pages/AddAudio";
import AddContact from "./pages/AddContact";
import AddCampaign from "./pages/AddCampaign";

export default function App() {
  return (
    <Routes>
  <Route path="/login" element={<Login />} />

  <Route
    path="/"
    element={
      <ProtectedRoute>
        <MainDashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="add-audio" element={<AddAudio />} />
    <Route path="add-contact" element={<AddContact />} />
    <Route path="add-campaign" element={<AddCampaign />} />
  </Route>

  <Route path="*" element={<Navigate to="/login" />} />
</Routes>

  );
}
