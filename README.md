# WEBDOT 고정밀 클론 (Frontend + Backend)

요청사항에 맞춰, 정적 목업이 아닌 **실행 가능한 전체 흐름**으로 구성했습니다.

## 포함 범위
- 고정밀 랜딩 UI (히어로/포트폴리오/서비스/FAQ/문의)
- 슬라이더, 스크롤 리빌, 카운터 애니메이션
- 문의 API + 관리자 조회 API + 간이 관리자 페이지
- 데이터 저장(JSON), 유효성 검사, Rate Limit

## 실행
```bash
cd /workspace/dddd
node server.js
```
- 사용자 페이지: `http://localhost:5500`
- 관리자 페이지: `http://localhost:5500/admin.html`

## API
- `GET /api/health`
- `POST /api/inquiries`
- `GET /api/inquiries` (`x-admin-token` 필요)

## 환경변수
- `PORT` (기본 5500)
- `ADMIN_TOKEN` (기본 `change-me-admin-token`)

```bash
ADMIN_TOKEN='my-secret-token' PORT=8080 node server.js
```

## 데이터 파일
- `data/inquiries.json`

## 에셋 정책
- 외부 핫링크 이미지 대신 `assets/*.svg` 자체 제작 에셋을 사용합니다.
- 무료/상업 이용 가능한 자체 생성 그래픽으로 교체하여 저작권 리스크를 낮췄습니다.

## 중요 안내
- 본 결과물은 현재 환경에서 확인 가능한 정보/구조 기반으로 고정밀 재현한 버전입니다.
- 실제 99.9% 완전 동일도를 위해서는 원본 사이트 접근 권한, 원본 폰트/모션 스펙이 필요합니다.
