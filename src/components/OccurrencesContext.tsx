import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Occurrence {
  id: number;
  tipo: string;
  local: string;
  status: "Novo" | "Em Análise" | "Concluído";
  data: string;
  timestamp: Date;
  descricao?: string;
  responsavel?: string;
}

interface OccurrencesContextType {
  occurrences: Occurrence[];
  addOccurrence: (occurrence: Omit<Occurrence, "id" | "timestamp">) => void;
  updateOccurrence: (id: number, updates: Partial<Occurrence>) => void;
  deleteOccurrence: (id: number) => void;
  getStats: () => { total: number; pendentes: number; resolvidos: number };
}

const OccurrencesContext = createContext<OccurrencesContextType | undefined>(undefined);

const INITIAL_DATA: Occurrence[] = [
  {
    id: 1,
    tipo: "Risco",
    local: "Rua A",
    status: "Novo",
    data: "Há 5 min",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    descricao: "Risco de desabamento",
  },
  {
    id: 2,
    tipo: "Alagamento",
    local: "Av. Principal",
    status: "Em Análise",
    data: "Há 2 horas",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    descricao: "Alagamento na via principal",
  },
  {
    id: 3,
    tipo: "Trânsito",
    local: "Ponte C",
    status: "Concluído",
    data: "Ontem",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    descricao: "Acidente de trânsito",
  },
];

export const OccurrencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>(INITIAL_DATA);

  const addOccurrence = (occurrence: Omit<Occurrence, "id" | "timestamp">) => {
    const newOccurrence: Occurrence = {
      ...occurrence,
      id: Date.now(),
      timestamp: new Date(),
    };
    setOccurrences((prev) => [newOccurrence, ...prev]);
  };

  const updateOccurrence = (id: number, updates: Partial<Occurrence>) => {
    setOccurrences((prev) =>
      prev.map((occ) => (occ.id === id ? { ...occ, ...updates } : occ))
    );
  };

  const deleteOccurrence = (id: number) => {
    setOccurrences((prev) => prev.filter((occ) => occ.id !== id));
  };

  const getStats = () => {
    const total = occurrences.length;
    const pendentes = occurrences.filter(
      (occ) => occ.status === "Novo" || occ.status === "Em Análise"
    ).length;
    const resolvidos = occurrences.filter((occ) => occ.status === "Concluído").length;

    return { total, pendentes, resolvidos };
  };

  return (
    <OccurrencesContext.Provider
      value={{
        occurrences,
        addOccurrence,
        updateOccurrence,
        deleteOccurrence,
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