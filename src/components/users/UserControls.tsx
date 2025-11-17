import React from "react";

interface UserControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
}

const UserControls: React.FC<UserControlsProps> = ({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}) => {
  const filters = [
    { value: "all", icon: "fa-list", label: "Todos" },
    { value: "Ativo", icon: "fa-check-circle", label: "Ativos" },
    { value: "Inativo", icon: "fa-times-circle", label: "Inativos" },
    { value: "Pendente", icon: "fa-clock", label: "Pendentes" },
  ];

  return (
    <div className="users-controls">
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Buscar por nome, email ou departamento..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.value}
            className={`filter-btn ${
              selectedFilter === filter.value ? "active" : ""
            }`}
            onClick={() => onFilterChange(filter.value)}
          >
            <i className={`fas ${filter.icon}`}></i>
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserControls;