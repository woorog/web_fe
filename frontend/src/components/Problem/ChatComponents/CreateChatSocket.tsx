import { io } from 'socket.io-client';
type SocketCallback = Record<string, any>;

export default function createSocket(socketURL: string, socketCallback: SocketCallback) {
  const socket = io(socketURL, {
    path: '/socket-chat/',
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  
  Object.entries(socketCallback).forEach(([event, callback]) => {
    socket.on(event, callback);
  });

  return socket;
}