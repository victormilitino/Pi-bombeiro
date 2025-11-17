import React from "react";

interface UserStatsCardsProps {
  stats: {
    total: number;
    ativos: number;
    inativos: number;
    pendentes: number;
  };
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ stats }) => {
  return (
    <div className="users-stats">
      <div className="stat-card">
        <div className="stat-icon" style={{ background: "#4ecdc420" }}>
          <i className="fas fa-users" style={{ color: "#4ecdc4" }}></i>
        </div>
        <div className="stat-info">
          <h3>{stats.total}</h3>
          <p>Total de Usuários</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: "#10b98120" }}>
          <i className="fas fa-user-check" style={{ color: "#10b981" }}></i>
        </div>
        <div className="stat-info">
          <h3>{stats.ativos}</h3>
          <p>Usuários Ativos</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: "#6b728020" }}>
          <i className="fas fa-user-times" style={{ color: "#6b7280" }}></i>
        </div>
        <div className="stat-info">
          <h3>{stats.inativos}</h3>
          <p>Usuários Inativos</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: "#f59e0b20" }}>
          <i className="fas fa-user-clock" style={{ color: "#f59e0b" }}></i>
        </div>
        <div className="stat-info">
          <h3>{stats.pendentes}</h3>
          <p>Cadastros Pendentes</p>
        </div>
      </div>
    </div>
  );
};

export default UserStatsCards;