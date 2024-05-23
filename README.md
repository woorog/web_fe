
<div align="center">
  <img src="https://github.com/your-repo/your-project/assets/your-image-id">
  <h3>동료들과 함께 알고리즘을 학습하고 소통할 수 있는 플랫폼</h3>
  <h5>🗝️ KeyWords<h5>
  <p>#WebRTC #Socket #CRDT #CodeMirror #TLdraw</p>
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
  <a href="https://youtu.be/your-presentation-link">발표영상</a>
</div>
🔎 주요 기능
🖥️ 코드 에디터
Yjs와 CodeMirror를 사용하여 실시간 동시 편집이 가능합니다.
협업을 통해 더 나은 알고리즘 문제 해결을 경험하세요.
CodeEditor
코드 에디터에서 실시간으로 코드 편집하기
📝 화이트 보드
TLdraw와 소켓 연결을 통해 여러 사용자가 실시간으로 브레인스토밍 보드를 사용할 수 있습니다.
팀원들과 아이디어를 공유하고 협력할 수 있는 효율적인 도구입니다.
WhiteBoard
화이트 보드에서 실시간으로 아이디어 공유하기
📹 화상 채팅
WebRTC와 PeerJS를 사용하여 P2P 스트리밍을 구현하였습니다.
Socket.IO를 통해 신호 교환을 처리하고, 직접 연결된 메쉬 네트워크를 통해 오디오와 비디오를 스트리밍합니다.
VideoChat
화상 채팅을 통해 동료와 소통하기
💬 채팅 + AI 찬스
Redis Pub/Sub과 소켓을 사용하여 사용자 간 실시간 채팅이 가능합니다.
Clova AI LLM을 통합하여 사용자와 AI 간 상호작용을 통해 협업을 돕습니다.
Chat
사용자와 AI와의 실시간 채팅
📝 문제 보기 (백준 알고리즘)
Puppetter와 Chromium 브라우저를 사용하여 필요한 정보를 수집합니다.
Cheerio를 통해 태그를 파싱하고 제거하며, Redis 캐시를 활용하여 요청 시간을 단축시킵니다.
ProblemView
백준 문제를 실시간으로 불러오기
🔎 기술적 도전
문제 인식
서비스의 특성상 '실시간성'이 강조되어 서버 부하가 심해졌습니다.
해결 방법
실시간성이 낮은 모듈은 다수 API 호출로 변경하여 서버 부하를 줄이고 Redis 캐싱을 통해 속도를 향상시켰습니다.
기존 소켓 서버의 Vertical Scaling 문제를 해결하기 위해 Redis Pub/Sub을 활용하여 Horizontal Scaling이 가능하도록 서버 환경을 구축했습니다.
기존 설계와 보완 결과
문제 크롤러 호출 시 같은 방 유저들이 같은 문제를 호출하는 경우를 고려하여 Redis 캐싱을 통해 Request 속도를 향상시켰습니다.
여러 개의 소켓을 사용하던 기존 구조에서 Vertical Scaling만 가능한 문제를 Redis Pub/Sub과 Load Balancer를 통해 Horizontal Scaling이 가능하도록 개선했습니다.
🔎 개발기
개발 과정에서 학습한 내용과 해결 방법을 기록했습니다.

[프론트엔드]

WebRTC 이해하기
S3와 CloudFront를 통한 프론트엔드 배포
로컬 환경에서 쿠키 테스트하기
채팅창 쓰로틀링 적용하기
쉘 스크립트로 디렉토리별 pre-commit 적용하기
[백엔드]

세션을 활용해 로그인 후 원래 위치로 돌아가기
Transaction 관심사 분리하기
SSL Termination을 통한 안전한 HTTP 통신
Blue-Green 무중단 배포
Clova X 도입하기
서버에서 OAuth 처리하기
👉 더 많은 기술 정리 보러가기

🔎 서버 아키텍처
ServerArchitecture

🔎 팀 소개
팀원1	팀원2	팀원3	팀원4
<img src="https://avatars.githubusercontent.com/u/your-id?v=4" width="200" />	<img src="https://avatars.githubusercontent.com/u/your-id?v=4" width="200" />	<img src="https://avatars.githubusercontent.com/u/your-id?v=4" width="200">	<img src="https://avatars.githubusercontent.com/u/your-id?v=4" width="200">
Front-End	Front-End	Back-End	Back-End
@github-id	@github-id	@github-id	@github-id
Team

우리가 일하는 방식
그라운드 룰
깃 컨벤션
게더타운 규칙
<a href="https://your-notion-link">😽 Team Notion</a>
