import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import occurrencesAPI from "../services/api";

export interface Occurrence {
  id: string;
  tipo: string;
  local: string;
  endereco: string;
  status: "NOVO" | "EM_ANALISE" | "EM_ATENDIMENTO" | "CONCLUIDO" | "CANCELADO";
  prioridade: string;
  data: string;
  timestamp: Date;
  descricao?: string;
  responsavel?: string;
  latitude: number;
  longitude: number;
}

interface OccurrencesContextType {
  occurrences: Occurrence[];
  loading: boolean;
  addOccurrence: (occurrence: any) => Promise<void>;
  updateOccurrence: (id: string, updates: any) => Promise<void>;
  deleteOccurrence: (id: string) => Promise<void>;
  refreshOccurrences: () => Promise<void>;
  getStats: () => { total: number; pendentes: number; resolvidos: number };
}

const OccurrencesContext = createContext<OccurrencesContextType | undefined>(
  undefined
);

export const OccurrencesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshOccurrences = async () => {
    try {
      setLoading(true);
      const response: any = (await occurrencesAPI.get("/occurrences")).data;
      if (response.success) {
        const formatted = response.data.map((occ: any) => ({
          ...occ,
          data: new Date(occ.createdAt).toLocaleString("pt-BR"),
          timestamp: new Date(occ.createdAt),
        }));
        setOccurrences(formatted);
      }
    } catch (error) {
      console.error("Erro ao carregar ocorrências:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshOccurrences();
    }
  }, []);

  const addOccurrence = async (occurrenceData: any) => {
    const response: any = (await occurrencesAPI.post("/occurrences", occurrenceData)).data;
    if (response.success) {
      await refreshOccurrences();
    }
  };

  const updateOccurrence = async (id: string, updates: any) => {
    const response: any = (await occurrencesAPI.put(`/occurrences/${id}`, updates)).data;
    if (response.success) {
      await refreshOccurrences();
    }
  };

  const deleteOccurrence = async (id: string) => {
    const response: any = (await occurrencesAPI.delete(`/occurrences/${id}`)).data;
    if (response.success) {
      await refreshOccurrences();
    }
  };

  const getStats = () => {
    const total = occurrences.length;
    const pendentes = occurrences.filter(
      (occ) => occ.status === "NOVO" || occ.status === "EM_ANALISE"
    ).length;
    const resolvidos = occurrences.filter(
      (occ) => occ.status === "CONCLUIDO"
    ).length;
    return { total, pendentes, resolvidos };
  };

  return (
    <OccurrencesContext.Provider
      value={{
        occurrences,
        loading,
        addOccurrence,
        updateOccurrence,
        deleteOccurrence,
        refreshOccurrences,
        getStats,
      }}
    >
      {children}
    </OccurrencesContext.Provider>
  );
};

export const useOccurrences = () => {
  const context = useContext(OccurrencesContext);
  if (!context) {
    throw new Error("useOccurrences must be used within OccurrencesProvider");
  }
  return context;
};
