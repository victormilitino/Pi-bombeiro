export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Ativo":
      return "#10b981";
    case "Inativo":
      return "#6b7280";
    case "Pendente":
      return "#f59e0b";
    default:
      return "#6b7280";
  }
};