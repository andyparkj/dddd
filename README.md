# WEBDOT Full Implementation (프론트엔드 + 백엔드)

비전공자도 실행 가능한 방식으로, **클론 페이지 + 문의 백엔드 API**가 한 번에 동작하도록 구성했습니다.

## 포함 기능
- 고급 랜딩 페이지 UI (애니메이션/슬라이드/반응형)
- 문의 폼 실전 API 연동 (`POST /api/inquiries`)
- 관리자 조회 API (`GET /api/inquiries`) + 토큰 인증
- 요청 제한(Rate Limit), 유효성 검사, 데이터 저장(JSON 파일)

## 1분 실행
```bash
cd /workspace/dddd
node server.js
```
브라우저에서 `http://localhost:5500` 접속.

## API 설명
### 상태 확인
- `GET /api/health`

### 문의 접수
- `POST /api/inquiries`
- Body(JSON):
```json
{
  "name": "홍길동",
  "company": "웹닷",
  "phone": "010-1234-5678",
  "email": "hello@example.com",
  "message": "홈페이지 제작 문의"
}
```

### 관리자 조회
- `GET /api/inquiries`
- Header: `x-admin-token: <ADMIN_TOKEN>`
- 기본 토큰: `change-me-admin-token` (운영 전 반드시 변경)

## 환경변수
- `PORT` (기본 5500)
- `ADMIN_TOKEN` (기본 `change-me-admin-token`)

예시:
```bash
ADMIN_TOKEN='my-secret-token' PORT=8080 node server.js
```

## 데이터 저장 위치
- `data/inquiries.json`

## 비전공자 운영 흐름
1. `node server.js` 실행
2. 사이트 열기
3. 문의 폼 제출 테스트
4. 관리자 API로 접수 확인
5. 필요 시 텍스트/이미지 수정

## 참고
- 이미지 배경은 상업적 무료 소스(Unsplash) URL 기반 예시입니다.
- 운영 전에는 실제 라이선스/출처 정책을 별도 확인해야 합니다.
