> *라이브 코딩 면접을 준비하는데 어려움이 있었습니다. <br/> 팀 단위로 진행되는 알고리즘 문제 풀이 대회를 준비하는데 어려움이 있었습니다. <br/> 그런 어려움을 해결하기 위한 서비스입니다.*
> 

<br/>


팀 단위로 진행되는 코딩 테스트나 대회를 연습할 수 있습니다.

라이브 코딩을 연습해 볼 수 있습니다.



# ⚒️개발환경 및 라이브러리

<br/>

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/styled--components-DB7093?style=flat-square&logo=styled-components&logoColor=white"/><br>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeORM-FF4716?style=flat-square&logo=%20Actions&logoColor=white"/><br>
  <img src="https://img.shields.io/badge/github action-2671E5?style=flat-square&logo=GitHub%20Actions&logoColor=white"/>
  <img src="https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=Jest&logoColor=white"/>
  <img src="https://img.shields.io/badge/socket.io-010101?style=flat-square&logo=socket.io&logoColor=white">
  <img src="https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=NGINX&logoColor=white">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white">
  <img src="https://img.shields.io/badge/NCloud-03C75A?style=flat-square&logo=Naver&logoColor=white">
</div>

<br/>
<br>

## 필요 파일
### backend/.env
```
# development

MYSQL_DATABASE=camperRank
MYSQL_HOST=
MYSQL_PASSWORD=
MYSQL_PORT=
MYSQL_USERNAME=
SERVERLESS_GRADE_JAVASCRIPT=
SERVERLESS_GRADE_PYTHON=
JWT_SECRETKEY=
```
### frontend/.env
```
# development
VITE_CLIENT_URL="http://127.0.0.1:3232/"
VITE_SERVER_URL="http://127.0.0.1:3000/api"
VITE_SOCKET_SERVER_URL="ws://127.0.0.1:3333"
VITE_SOCKET_URL="ws://127.0.0.1:4444/"
```
## 구동 명령어
```
#각 디렉토리 공통
yarn install

cd backend
yarn start:dev

cd frontend
yarn dev

cd frontend
npx y-webrtc

cd socket
yarn start

cd chat
yarn start

redis-server
```


<br>

# 🎯프로젝트 주요 기능

<img src="https://user-images.githubusercontent.com/46220202/207910934-2f993898-927f-42dc-8c1b-4822e75e7771.gif" />
온라인으로 PS 문제를 해결할 수 있습니다.
<br>
<br>
<img src="https://user-images.githubusercontent.com/62196278/208003205-8a58dac4-3a5d-43e4-b69b-839a43749a98.gif"/>
공동 편집 기능으로 같이 코드를 편집할 수 있습니다.
<br>
<br>

<br/>
