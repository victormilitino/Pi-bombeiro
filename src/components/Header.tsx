import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

// Adicionamos a interface para aceitar o toggle do Layout
interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <header className="dashboard-header">
      {/* Botão Mobile (Só aparece em telas pequenas via CSS) */}
      <div className="mobile-menu-btn" onClick={onToggleSidebar}>
        <i className="fas fa-bars"></i>
      </div>

      {/* Search Bar */}
      <div className="header-search">
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Buscar ocorrências, usuários, relatórios..." 
        />
      </div>

      {/* Right Section: User */}
      <div className="header-actions">
        <div className="header-user-wrapper">
          <div 
            className="header-user"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-info">
              <span className="user-name">Admin Silva</span>
              <span className="user-role">Administrador</span>
            </div>
            <i className="fas fa-chevron-down"></i>
          </div>

          {showDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-item">
                <i className="fas fa-user"></i>
                <span>Meu Perfil</span>
              </div>
              <div className="dropdown-item">
                <i className="fas fa-cog"></i>
                <span>Configurações</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Sair</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;