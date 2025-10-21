import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const menuItems = [
    {
      id: "dashboard",
      icon: "fas fa-home",
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      id: "occurrences",
      icon: "fas fa-exclamation-circle",
      label: "Ocorrências",
      path: "/occurrences",
    },
    { id: "map", icon: "fas fa-map-marked-alt", label: "Mapa", path: "/map" },
    {
      id: "reports",
      icon: "fas fa-chart-line",
      label: "Relatórios",
      path: "/reports",
    },
    { id: "users", icon: "fas fa-users", label: "Usuários", path: "/users" },
    {
      id: "settings",
      icon: "fas fa-cog",
      label: "Configurações",
      path: "/settings",
    },
  ];

  const handleItemClick = (item: any) => {
    setActiveItem(item.id);
    // Navegação comentada pois as rotas ainda não existem
    // navigate(item.path);
  };

  return (
    <aside className="sidebar">
      {/* Logo/Brand */}
      <div className="sidebar-brand">
        <i className="fas fa-shield-alt"></i>
        <span>PI-Bombeiro</span>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${activeItem === item.id ? "active" : ""}`}
            onClick={() => handleItemClick(item)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Administrador</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
