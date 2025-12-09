import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

// Interface igualzinha à que o Backend devolve
export interface Occurrence {
  timestamp(timestamp: any): React.ReactNode;
  id: string; // Backend usa UUID (string)
  tipo: string;
  local: string;
  endereco: string;
  latitude: number;
  longitude: number;
  status: 'NOVO' | 'EM_ANALISE' | 'EM_ATENDIMENTO' | 'CONCLUIDO';
  prioridade: string;
  dataOcorrencia: string; // Vem como string ISO do JSON
  fotos: string[];
}

interface OccurrencesContextData {
  occurrences: Occurrence[];
  loading: boolean;
  getStats: () => { pendentes: number; resolvidos: number; total: number };
  refreshData: () => Promise<void>;
}

const OccurrencesContext = createContext<OccurrencesContextData>({} as OccurrencesContextData);

export const OccurrencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Função que busca a lista inicial do banco
  const fetchOccurrences = async () => {
    try {
      const response = await api.get('/occurrences');
      // O backend retorna: { success: true, data: [...] }
      setOccurrences(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carrega dados ao abrir a tela
    fetchOccurrences();

    // 2. Conecta no WebSocket para ouvir novidades
    const socket = connectSocket();

    // Ouve quando uma nova ocorrência é criada
    socket.on('occurrence:new', (newOcc: Occurrence) => {
      console.log('🔔 Nova ocorrência recebida via Socket:', newOcc);
      setOccurrences((prev) => [newOcc, ...prev]);
    });

    // Ouve quando um status muda
    socket.on('occurrence:update', (updatedOcc: Occurrence) => {
      console.log('🔄 Ocorrência atualizada:', updatedOcc);
      setOccurrences((prev) =>
        prev.map((occ) => (occ.id === updatedOcc.id ? updatedOcc : occ))
      );
    });

    // Limpeza ao sair
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
    <OccurrencesContext.Provider value={{ occurrences, loading, getStats, refreshData: fetchOccurrences }}>
      {children}
    </OccurrencesContext.Provider>
  );
};

export const useOccurrences = () => useContext(OccurrencesContext);