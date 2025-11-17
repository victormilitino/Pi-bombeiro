import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UserStatsCards from "../components/users/UserStatsCards";
import UserControls from "../components/users/UserControls";
import UsersTable from "../components/users/UsersTable";
import UserDetailsModal from "../components/users/UserDetailsModal";
import { User } from "../types/User";
import { mockUsers } from "../data/mockUsers";
import "../styles/Dashboard.css";
import "../styles/UsersPage.css";

const UsersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [users] = useState<User[]>(mockUsers);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.departamento.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || user.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const stats = {
    total: users.length,
    ativos: users.filter((u) => u.status === "Ativo").length,
    inativos: users.filter((u) => u.status === "Inativo").length,
    pendentes: users.filter((u) => u.status === "Pendente").length,
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </aside>

      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      />

      <div className="main-content">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="dashboard-main-content">
          <div className="page-container">
            <div className="page-header">
              <div className="page-title-section">
                <h1 className="page-title">
                  <i className="fas fa-users"></i>
                  Gerenciamento de Usuários
                </h1>
                <p className="page-subtitle">
                  Gerencie todos os usuários do sistema e suas permissões
                </p>
              </div>
              <button className="btn-primary">
                <i className="fas fa-user-plus"></i>
                Novo Usuário
              </button>
            </div>

            <UserStatsCards stats={stats} />

            <UserControls
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />

            <UsersTable
              users={filteredUsers}
              onViewUser={openUserModal}
            />
          </div>
        </main>
      </div>

      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={closeUserModal}
        />
      )}
    </div>
  );
};

export default UsersPage;