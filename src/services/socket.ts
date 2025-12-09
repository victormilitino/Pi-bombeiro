import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

// Tipagem dos eventos para o TypeScript não reclamar
interface ServerToClientEvents {
  'occurrence:new': (data: any) => void;
  'occurrence:update': (data: any) => void;
}

let socket: Socket<ServerToClientEvents> | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'], // Força websocket para ser mais rápido
      autoConnect: true,
    });
    console.log('📡 Conectando ao Socket.io...');
  }
  
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const getSocket = () => socket;