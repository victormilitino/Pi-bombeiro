import React from "react";
import { User } from "../../types/User";
import { getStatusColor } from "../../utils/userUtils";

interface UserTableRowProps {
  user: User;
  onViewUser: (user: User) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ user, onViewUser }) => {
  return (
    <tr>
      <td>
        <div className="user-info">
          <div
            className="user-avatar"
            style={{
              background: getStatusColor(user.status) + "20",
              color: getStatusColor(user.status),
            }}
          >
            {user.avatar}
          </div>
          <div className="user-details">
            <strong>{user.nome}</strong>
            <span>{user.email}</span>
          </div>
        </div>
      </td>
      <td>{user.cargo}</td>
      <td>
        <span className="department-badge">{user.departamento}</span>
      </td>
      <td>
        <span
          className="status-badge"
          style={{
            background: getStatusColor(user.status) + "20",
            color: getStatusColor(user.status),
          }}
        >
          {user.status}
        </span>
      </td>
      <td className="last-access">{user.ultimoAcesso}</td>
      <td>
        <div className="action-buttons">
          <button
            className="btn-icon btn-view"
            onClick={() => onViewUser(user)}
            title="Ver Detalhes"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button className="btn-icon btn-edit" title="Editar">
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn-icon btn-delete" title="Excluir">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;