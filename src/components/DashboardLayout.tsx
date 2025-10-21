import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardContent from "./DashboardContent";
import "../styles/Dashboard.css";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  // Lógica de proteção de rota (sem PrivateRoute)
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // O layout principal
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <DashboardContent />
      </div>
    </div>
  );
};

export default DashboardLayout;
