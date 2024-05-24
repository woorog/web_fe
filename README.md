<div align="center">
  <img src="https://github.com/woorog/web_fe/assets/154962837/c14231bf-1d8d-4c68-beb2-022ff2e7cae0">

  <h2>동료들과 함께 알고리즘을 학습하고 소통할 수 있는 플랫폼</h2>
  <h4>🗝️ KeyWords <h4/>
  <p> #Algorithm #CodeMirror #CRDT #TLdraw #WebRTC #Socket #ClovaAI</p>
  <br>
  <div align="center">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/>
    <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white"/>
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/>
    <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white"/>
    <img src="https://img.shields.io/badge/WebRTC-333333?style=flat-square&logo=WebRTC&logoColor=white"/>
    <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=Socket.io&logoColor=white"/>
    <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white"/>
    <img src="https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=Nginx&logoColor=white"/>
  </div>
  <br>
  <a href="https://www.youtube.com/your-demo-link">🎥 데모영상</a>
  <a href="https://youtu.be/your-presentation-link">🎤 발표영상</a>
</div>

---

# 기획의도
크래프톤 정글에서 가장 많이 성장을 체감했던 알고리즘 코어타임을 정글 이후에도 온라인으로 다시 한번 해보기 위해 제작했습니다.


# 서비스 소개
알고리즘 문제를 실시간으로 협업하여 풀 수 있는 웹 서비스


# 기능 소개

### ⚙️ 코드 에디터
- Yjs와 CodeMirror를 사용하여 실시간 동시 편집이 가능합니다.

| ![Code Editor](https://github.com/woorog/web_fe/assets/154962837/3af67b05-be2d-4ccd-8ff5-c5fe6a22971f) |
| ----------------------------------------------------------------------------- |
| 코드 에디터에서 실시간으로 코드 편집하기                                      |

### 📝 화이트 보드
- TLdraw와 소켓 연결을 사용하여 여러 구성원이 실시간으로 브레인스토밍 보드로 사용하도록 고안했습니다.
- 이를 통해 팀원들과 아이디어를 실시간으로 공유하고 협력할 수 있습니다.

| ![White Board](https://github.com/woorog/web_fe/assets/154962837/02b0d15b-38b0-4093-bc43-bbac36946c60)|
| ----------------------------------------------------------------------------- |
| 화이트 보드에서 실시간으로 아이디어 공유하기                                  |

### 🧑‍🧑‍🧒‍🧒 화상 채팅
- WebRTC와 PeerJS를 사용하여 P2P 스트리밍을 구현하였습니다.
- Socket.IO를 통해 신호 교환을 처리하고, 사용자가 특정 방에 접속할 때 소켓은 방 참가자를 관리하고 신호 메시지 처리를 통해 P2P 연결을 설정합니다.
- 직접 연결된 메쉬 네트워크를 통해 오디오와 비디오를 스트리밍합니다.

| ![VideoChat](https://github.com/woorog/web_fe/assets/154962837/492c86b7-7534-4df4-80ac-f85602ca1e89)|
| ----------------------------------------------------------------------------- |
| 화상 채팅을 통해 동료와 소통하기                                              |

### 💬 채팅 + AI 찬스
- Redis Pub/Sub과 소켓을 사용하여 사용자 간 실시간 채팅이 가능합니다.
- Clova AI LLM을 통합하여 사용자와 AI 간 상호작용을 통해 효율적으로 협업할 수 있습니다.

| ![Chat](https://github.com/woorog/web_fe/assets/154962837/ac6b198c-d885-452a-8b15-ceb7b93b8dc6)|
| ----------------------------------------------------------------------- |
| 사용자와 AI와의 실시간 채팅                                              |

### 📝 문제 보기 (백준 알고리즘)
- Puppetter와 Chromium 브라우저를 사용하여 필요한 정보를 수집합니다.
- Cheerio를 통해 태그를 파싱하고 제거하며, Redis 캐시를 활용하여 요청 시간을 단축시킬 수 있었습니다.

| ![Problem View](https://github.com/woorog/web_fe/assets/154962837/26ee2def-1c06-430f-b28e-d240b52fe7aa)|
| ------------------------------------------------------------------------------ |
| 백준 문제를 실시간으로 불러오기                                                |

# ❗기술적 챌린지

### 문제 인식
서비스의 특성상 '실시간성'이 강조되며, 이에 따른 서버의 부하가 심해져 이를 줄이기 위한 방법의 필요성을 느끼게 되었습니다.

### 해결 방법

1. **실시간성 낮은 모듈의 최적화**
   - 실시간성이 낮은 모듈의 경우 소켓의 활용도가 낮다고 판단하여 다수 API 호출로 변경하여 서버의 부하를 줄이고 Redis 캐싱을 통해 속도를 향상시켰습니다.

2. **소켓 서버의 Vertical Scaling 문제 해결**
   - 기존 소켓 서버의 구성으로 발생하는 Vertical Scaling 문제를 해결하기 위해 Redis Pub/Sub을 활용하여 Horizontal Scaling이 가능하도록 서버 환경을 구축했습니다.
   - 문제 크롤러 호출 시 같은 방 유저들이 같은 문제를 호출할 가능성을 고려하여 Redis 캐싱으로 Request 속도를 향상시켰습니다.

3. **채팅 서버 부하 분산**
   - 여러 개의 소켓을 사용하기 때문에 부하 발생 시 Scaling 방법으로 Vertical Scaling 옵션만이 존재했으나, Redis Pub/Sub과 Load Balancer를 함께 사용하여 Horizontal Scaling 옵션도 가능하도록 서버 환경을 개선했습니다.
   - 기존 서비스에 영향을 크게 주지 않는 채팅 서버를 통해 부하를 줄이는 방법을 시도하였습니다.

# 🔎 개발환경

개발 환경 설정은 다음과 같습니다.

# [.env]
```
<web_fe/backend>
MYSQL_DATABASE=userdb
MYSQL_HOST=localhost
MYSQL_PASSWORD=yours
MYSQL_PORT=3308
MYSQL_USERNAME=hello
SERVERLESS_GRADE_JAVASCRIPT=
SERVERLESS_GRADE_PYTHON=
JWT_SECRETKEY=secret
```
```
<web_fe/frontend>
VITE_CLIENT_URL="http://127.0.0.1:5173/"
VITE_SERVER_URL="http://127.0.0.1:3000/api"

VITE_SOCKET_SERVER_URL="ws://127.0.0.1:3333"
VITE_SOCKET_URL="ws://127.0.0.1:4444/"

VITE_CHAT_SOCKET_SERVER_URL="ws://127.0.0.1:8888/"
VITE_SOCKET_CANVAS_URL="ws://127.0.0.1:5555/"

<web_fe/chat>
?# common (? 빼세요)
NODE_ENV=dev
PORT=8888

?# cors
ALLOWED_ORIGIN=*
EXPOSE_HEADER=

?# redis
REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PASSWORD=
CACHE_TTL=300

?# mongo
MONGO_DEV=mongodb://localhost:27017/admin
MONGO_PROD=mongodb://localhost:27017/admin

?# clova
LLM_URL=yours
```

# [setting]
```
<터미널로 5개의 소켓을 열으신 후>

cd backend; yarn install; yarn start:dev

cd frontend; yarn install; yarn dev

cd frontend; yarn install; npx y-webrtc

cd socket; yarn install; yarn dev

cd chat; yarn install; yarn start
```


# 🔗 서버 아키텍처

![server](https://github.com/woorog/web_fe/assets/154962837/d4d8f7a6-d63f-4a4e-b1d0-73abde0a3edc)


# 👻 팀 소개 (Krafton Jungle 4th)

![Team](https://github.com/woorog/web_fe/assets/154962837/43c73d69-d1fd-47cd-b548-852dc9797157)

# 📃 프로젝트 포스터

![Poster](https://github.com/woorog/web_fe/assets/154962837/d44334fa-be21-4643-addf-3db99ae0bef0)


