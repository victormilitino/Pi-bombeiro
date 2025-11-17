import React from "react";
import { User } from "../../types/User";
import { getStatusColor } from "../../utils/userUtils";

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
  const infoItems = [
    { icon: "fa-envelope", label: "Email", value: user.email },
    { icon: "fa-phone", label: "Telefone", value: user.telefone },
    { icon: "fa-briefcase", label: "Cargo", value: user.cargo },
    { icon: "fa-building", label: "Departamento", value: user.departamento },
    { icon: "fa-calendar-plus", label: "Data de Registro", value: user.dataRegistro },
    { icon: "fa-clock", label: "Último Acesso", value: user.ultimoAcesso },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-user"></i>
            Detalhes do Usuário
          </h2>
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="user-detail-section">
            <div
              className="user-avatar-large"
              style={{
                background: getStatusColor(user.status) + "20",
                color: getStatusColor(user.status),
              }}
            >
              {user.avatar}
            </div>
            <h3>{user.nome}</h3>
            <span
              className="status-badge-large"
              style={{
                background: getStatusColor(user.status) + "20",
                color: getStatusColor(user.status),
              }}
            >
              {user.status}
            </span>
          </div>

          <div className="user-info-grid">
            {infoItems.map((item, index) => (
              <div key={index} className="info-item">
                <i className={`fas ${item.icon}`}></i>
                <div>
                  <label>{item.label}</label>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="permissions-section">
            <h4>
              <i className="fas fa-key"></i>
              Permissões
            </h4>
            <div className="permissions-list">
              {user.permissoes.map((perm, index) => (
                <span key={index} className="permission-badge">
                  <i className="fas fa-check"></i>
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
          <button className="btn-primary">
            <i className="fas fa-edit"></i>
            Editar Usuário
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;