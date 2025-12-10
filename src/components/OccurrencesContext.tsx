import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

export interface Occurrence {
  id: string;
  tipo: string;
  local: string;
  endereco: string;
  latitude: number;
  longitude: number;
  status: 'NOVO' | 'EM_ANALISE' | 'EM_ATENDIMENTO' | 'CONCLUIDO';
  prioridade: string;
  dataOcorrencia: string; // Vem do backend
  timestamp: Date; // Usado pelo front (calculado)
  fotos: string[];
}

interface OccurrencesContextData {
  occurrences: Occurrence[];
  loading: boolean;
  getStats: () => { pendentes: number; resolvidos: number; total: number };
  refreshData: () => Promise<void>;
  addOccurrence: (data: any) => Promise<void>;
  updateOccurrence: (id: any, data: any) => Promise<void>;
  deleteOccurrence: (id: any) => Promise<void>;
}

const OccurrencesContext = createContext<OccurrencesContextData>({} as OccurrencesContextData);

export const OccurrencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOccurrences = async () => {
    try {
      const response = await api.get('/occurrences');
      const rawData = response.data.data || [];

      // Mapeia os dados garantindo que lat/lng sejam números e criando o timestamp
      const formattedData = rawData.map((occ: any) => ({
        ...occ,
        latitude: Number(occ.latitude),
        longitude: Number(occ.longitude),
        // O Dashboard precisa de um objeto Date no campo timestamp
        timestamp: occ.dataOcorrencia ? new Date(occ.dataOcorrencia) : new Date(),
      }));

      console.log("Dados carregados do Backend:", formattedData.length, "ocorrências");
      setOccurrences(formattedData);
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOccurrence = async (data: any) => {
    try {
      // Envia para o backend (o backend agora geocodifica sozinho)
      await api.post('/occurrences', data);
      // Não precisamos adicionar manualmente no state pois o Socket.io vai avisar
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert("Erro ao salvar ocorrência. Verifique o console.");
    }
  };

  const updateOccurrence = async (id: any, data: any) => {
    try {
      await api.put(`/occurrences/${id}`, data);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  const deleteOccurrence = async (id: any) => {
    try {
      await api.delete(`/occurrences/${id}`);
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  useEffect(() => {
    fetchOccurrences();

    const socket = connectSocket();

    socket.on('occurrence:new', (newOcc: any) => {
      console.log('🔔 Nova ocorrência via Socket:', newOcc);
      const safeOcc = { 
        ...newOcc, 
        latitude: Number(newOcc.latitude),
        longitude: Number(newOcc.longitude),
        timestamp: newOcc.dataOcorrencia ? new Date(newOcc.dataOcorrencia) : new Date() 
      };
      setOccurrences((prev) => [safeOcc, ...prev]);
    });

    socket.on('occurrence:update', (updatedOcc: any) => {
      setOccurrences((prev) =>
        prev.map((occ) => {
          if (occ.id === updatedOcc.id) {
            return {
              ...updatedOcc,
              latitude: Number(updatedOcc.latitude),
              longitude: Number(updatedOcc.longitude),
              timestamp: updatedOcc.dataOcorrencia ? new Date(updatedOcc.dataOcorrencia) : new Date()
            };
          }
          return occ;
        })
      );
    });

    return () => {
      socket.off('occurrence:new');
      socket.off('occurrence:update');
      disconnectSocket();
    };
  }, []);

  const getStats = () => {
    const pendentes = occurrences.filter(o => o.status !== 'CONCLUIDO').length;
    const resolvidos = occurrences.filter(o => o.status === 'CONCLUIDO').length;
    return { pendentes, resolvidos, total: occurrences.length };
  };

  return (
    <OccurrencesContext.Provider value={{ 
      occurrences, 
      loading, 
      getStats, 
      refreshData: fetchOccurrences,
      addOccurrence,
      updateOccurrence,
      deleteOccurrence
    }}>
      {children}
    </OccurrencesContext.Provider>
  );
};

export const useOccurrences = () => useContext(OccurrencesContext);