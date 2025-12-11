// types/index.ts

export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  telefone: string;
  avatar: string;
  status: "ATIVO" | "PENDENTE" | "INATIVO";
  permissoes: string[];
  createdAt: string;
  ultimoAcesso: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  cargo: string;
  departamento: string;
  telefone: string;
}

export interface Occurrence {
  id: string;
  tipo: string;
  descricao: string;
  endereco: string;
  latitude: number;
  longitude: number;
  status: "ABERTA" | "FECHADA" | "EM_ANDAMENTO";
  createdAt: string;
  userId: string;
  user?: User;
}

export interface OccurrenceForm {
  tipo: string;
  descricao: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
}

export interface Report {
  id: string;
  titulo: string;
  descricao: string;
  dataGeracao: string;
  tipo: "DIARIO" | "SEMANAL" | "MENSAL";
  occurrencesCount: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  statusCode?: number;
}