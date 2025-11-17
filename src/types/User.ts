export interface User {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  status: "Ativo" | "Inativo" | "Pendente";
  avatar: string;
  dataRegistro: string;
  ultimoAcesso: string;
  telefone: string;
  permissoes: string[];
}