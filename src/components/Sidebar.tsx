import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Dashboard.css";
import SicogLogo from "../assets/SicogLogo.png";

// Nova interface para aceitar o estado do menu mobile
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void; // Para fechar ao clicar em um item no mobile
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

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
    navigate(item.path);
    // Fecha a sidebar se estiver no mobile ao clicar em um item
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    // Aplicamos a classe 'open' diretamente aqui, baseada na prop
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <img src={SicogLogo} alt="Sicog Logo" className="brand-logo" />
        <span>SISOCC</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${
              currentPath === item.path ? "active" : ""
            }`}
            onClick={() => handleItemClick(item)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

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