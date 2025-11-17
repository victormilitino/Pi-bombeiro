import React from "react";
import { User } from "../../types/User";
import UserTableRow from "./UserTableRow";

interface UsersTableProps {
  users: User[];
  onViewUser: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onViewUser }) => {
  return (
    <div className="users-table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Cargo</th>
            <th>Departamento</th>
            <th>Status</th>
            <th>Último Acesso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onViewUser={onViewUser}
            />
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <p>Nenhum usuário encontrado</p>
        </div>
      )}
    </div>
  );
};

export default UsersTable;