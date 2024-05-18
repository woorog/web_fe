import express from 'express';
import * as http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { OPEN, Server as WebSocketServer } from 'ws';  // WS 라이브러리 import
import cors from 'cors';


const app = express();
const socketServerPort = 3333;
const webSocketServerPort = 5555;

app.use(cors());

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  cookie: true,
});

httpServer.listen(socketServerPort);

function logging(msg: string, param?: string) {
  if (!param) {
    console.log(`[${new Date().toLocaleString()}] ${msg}`);
    return;
  }
  console.log(`[${new Date().toLocaleString()}] ${msg}: ${param}`);
}

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    const room = io.sockets.adapter.rooms.get(roomId);

    if (room && room.size >= 3) {
      logging('Room is full, out userId: ', userId);
      socket.emit('full');
      return;
    }

    // logging('Join userId: ', userId);
    // logging('RoomId: ', roomId);
    
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    // socket.on('disconnect', () => {
    //   socket.to(roomId).emit('user-disconnected', userId);
    // });
  });

  socket.on('change-language', (roomId, code, lang) => {
    logging('RoomId: ', roomId);
    logging('Code: ', code);
    socket.to(roomId).emit('change-language', code, lang);
  });
});

const wsServer = new WebSocketServer({ port: webSocketServerPort });
wsServer.on('connection', socket => {
  socket.on('message', message => {
    wsServer.clients.forEach(client => {
      if (client !== socket && client.readyState === OPEN) {
        client.send(message);
      }
    });
  });

});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());