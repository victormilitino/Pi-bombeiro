import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const notifications = [
    { id: 1, text: "Nova ocorrência registrada", time: "Há 5 min", unread: true },
    { id: 2, text: "Relatório mensal disponível", time: "Há 1 hora", unread: true },
    { id: 3, text: "Manutenção agendada", time: "Há 3 horas", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="dashboard-header">

      
      {/* Search Bar */}
      <div className="header-search">
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Buscar ocorrências, usuários, relatórios..." 
        />
      </div>

      {/* Right Section: Notifications + User */}
      <div className="header-actions">
        {/* Notifications */}
        <div className="header-notification-wrapper">
          <button 
            className="header-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notificações</h4>
                <span className="mark-all-read">Marcar todas como lidas</span>
              </div>
              <div className="notification-list">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`notification-item ${notif.unread ? 'unread' : ''}`}
                  >
                    <div className="notification-icon">
                      <i className="fas fa-info-circle"></i>
                    </div>
                    <div className="notification-content">
                      <p>{notif.text}</p>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <a href="#">Ver todas as notificações</a>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <button className="header-icon-btn">
          <i className="fas fa-th"></i>
        </button>

        {/* User Profile */}
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
              <div className="dropdown-item">
                <i className="fas fa-question-circle"></i>
                <span>Ajuda</span>
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