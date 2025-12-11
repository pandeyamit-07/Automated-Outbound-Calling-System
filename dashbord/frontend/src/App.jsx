// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Topbar from "./components/dashboard/Topbar";
import AdminLogin from "./admin/Login";
import ProtectedRoute from "./admin/ProtectedRoute";

export default function App() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setAuth(Boolean(token));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={auth ? <Navigate to="/admin" replace /> : <AdminLogin setAuth={setAuth} />}
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div className="min-h-screen p-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                  <Topbar onRefresh={() => window.location.reload()} base={API_BASE} />
                  <div className="mt-6">
                    <Dashboard base={API_BASE} />
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Default — redirect to admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


