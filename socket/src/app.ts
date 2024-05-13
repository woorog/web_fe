import express from 'express';
import * as http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { OPEN, Server as WebSocketServer } from 'ws';  // WS 라이브러리 import

// Express 애플리케이션 생성
const app = express();
const socketServerPort = 3333;
const webSocketServerPort = 3334; // 웹소켓 서버 포트

// HTTP 서버 생성 및 Socket.IO 서버 설정
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',                // 모든 도메인에서의 요청 허용
    credentials: true,
    methods: ['GET', 'POST'],   // 허용되는 메소드
  },
  cookie: true,
});

// HTTP 서버 시작, 3333 포트에서 리스닝
httpServer.listen(socketServerPort, () => console.log(`Socket.IO server running on port ${socketServerPort}`));

// 로깅 함수 정의
function logging(msg: string, param?: string) {
  if (!param) {
    console.log(`[${new Date().toLocaleString()}] ${msg}`);
    return;
  }
  console.log(`[${new Date().toLocaleString()}] ${msg}: ${param}`);
}

// Socket.IO 연결 이벤트 처리
io.on('connection', (socket) => {
  // 새 사용자가 방에 참여할 때 처리
  socket.on('join-room', (roomId, userId) => {
    const room = io.sockets.adapter.rooms.get(roomId);

    // 방에 이미 최대 인원(3명)이 참여중이면, 추가 참여 불가 메시지 전송
    if (room && room.size >= 3) {
      logging('Room is full, out userId: ', userId);
      socket.emit('full');
      return;
    }

    // 방에 참여하고, 참여 사실을 방의 다른 멤버들에게 알림
    logging('Join userId: ', userId);
    logging('RoomId: ', roomId);

    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    // 사용자 연결 종료시 처리
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });

  // 코딩 언어 변경 이벤트 처리
  socket.on('change-language', (roomId, code, lang) => {
    logging('RoomId: ', roomId);
    logging('Code: ', code);
    socket.to(roomId).emit('change-language', code, lang);
  });
});

// 웹소켓 서버 설정 및 실행
const wsServer = new WebSocketServer({ port: webSocketServerPort });
wsServer.on('connection', socket => {
  // console.log('WebSocket client connected on port', webSocketServerPort);  // 자꾸 계속 뜸 원래 이런건지 모르겟음

  // socket.on('message', message => {
  //   console.log('Received message: ', message);
  // });

  // 받은 메시지를 다른 클라이언트에게 전달
  socket.on('message', message => {
    wsServer.clients.forEach(client => {
      if (client !== socket && client.readyState === OPEN) {    // 연결이 활성화 상태인지 확인
        client.send(message);
      }
    });
  });

  // WebSocket 클라이언트 연결 종료 처리
  socket.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Express 미들웨어 설정
app.use(express.urlencoded({ extended: true }));    // URL 인코딩된 데이터 파싱
app.use(express.json());    // JSON 데이터 파싱