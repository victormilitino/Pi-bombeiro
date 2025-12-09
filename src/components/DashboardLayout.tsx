import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom"; 
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/Dashboard.css";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* Overlay para fechar menu no mobile */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* PASSAMOS o estado como prop, em vez de envolver em outra div */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="main-content">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Renderiza as páginas internas limpas */}
        <Outlet /> 
      </div>
    </div>
  );
};

export default DashboardLayout;