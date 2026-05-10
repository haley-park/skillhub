# 🧠 Skillhub

**로컬 AI 스킬 관리 허브** — Anthropic의 SKILL.md 파일들을 한 곳에서 관리하고 테스트하는 개인용 도구입니다.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)

---

## 미리보기

### 스킬 라이브러리 홈
![홈 화면](docs/preview-home.svg)

### 스킬 상세 페이지
![상세 화면](docs/preview-detail.svg)

### 트리거 테스트 모달
![트리거 테스트](docs/preview-trigger.svg)

---

## 아키텍처

![아키텍처](docs/architecture.svg)

**핵심 원칙**
- **파일이 곧 진실** — SKILL.md가 디스크에서 정본. DB는 인덱스/캐시
- **watchdog 자동 감지** — `~/skillhub/skills/` 변경 시 2초 안에 UI 반영
- **로컬 단일 사용자** — 인증 없음. localhost only

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| 스킬 라이브러리 | SKILL.md 자동 스캔 · 카드 그리드 · 검색 · 태그 필터 |
| 실시간 동기화 | watchdog 파일 감시 + 5초 폴링으로 새로고침 없이 반영 |
| 트리거 테스트 | 사용자 메시지 입력 → Anthropic API로 스킬 호출 여부 판단 |
| 에디터 연동 | VSCode / 시스템 기본 앱으로 SKILL.md 바로 열기 |
| 토스 스타일 UI | Pretendard 폰트, Framer Motion 애니메이션, 반응형 |

---

## 기술 스택

### 백엔드
| 패키지 | 버전 | 역할 |
|---|---|---|
| FastAPI | 0.115 | REST API 서버 |
| SQLAlchemy | 2.0 (typed) | ORM / DB 인덱스 |
| PostgreSQL | 16 | 메타데이터 저장 |
| Alembic | 1.13 | DB 마이그레이션 |
| watchdog | 6.0 | 파일 시스템 감시 |
| python-frontmatter | 1.1 | YAML frontmatter 파싱 |
| anthropic | 0.40+ | 트리거 판단 API |

### 프론트엔드
| 패키지 | 버전 | 역할 |
|---|---|---|
| Next.js | 15.1 (App Router) | 라우팅, SSR |
| React | 19 | UI 컴포넌트 |
| TypeScript | 5.7 (strict) | 타입 안전성 |
| Tailwind CSS | 3.4 | 스타일링 |
| Framer Motion | 12 | 애니메이션 |
| Luxon | 3 | 상대 시간 표시 |
| react-markdown | 9 | 마크다운 렌더링 |

---

## 시작하기

### 사전 요구사항

- Python 3.11+
- Node.js 20+ + pnpm
- Docker & Docker Compose

### 1. 저장소 클론

```bash
git clone https://github.com/haley-park/skillhub.git
cd skillhub
```

### 2. 환경 변수 설정

```bash
cp backend/.env.example backend/.env
```

`backend/.env`를 열고 Anthropic API 키를 입력하세요:

```env
DATABASE_URL=postgresql+psycopg2://skillhub:skillhub@localhost:5432/skillhub
SKILLS_DIR=~/skillhub/skills
ANTHROPIC_API_KEY=sk-ant-...        # 여기에 입력
ANTHROPIC_MODEL=claude-sonnet-4-6
```

```bash
cp frontend/.env.local.example frontend/.env.local
```

### 3. 의존성 설치

```bash
make install
```

### 4. DB 실행 + 마이그레이션

```bash
make db-up
make migrate
```

### 5. 샘플 스킬 생성 (선택)

```bash
make seed
```

`~/skillhub/skills/`에 3개의 샘플 SKILL.md 파일이 생성됩니다.

### 6. 서버 실행

터미널 두 개를 열고 각각 실행합니다:

```bash
# 터미널 1 — 백엔드
make dev-backend

# 터미널 2 — 프론트엔드
make dev-frontend
```

**http://localhost:3000** 에서 확인하세요.

---

## SKILL.md 작성 방법

`~/skillhub/skills/<폴더명>/SKILL.md` 형식으로 파일을 생성하면 자동으로 등록됩니다.

```markdown
---
name: pdf-extraction
description: PDF 파일에서 텍스트와 표를 추출합니다.
tags: [pdf, document, extraction]
version: 1.0.0
icon: "📄"
---

# PDF Extraction Skill

본문 마크다운 내용...
```

| 필드 | 필수 | 설명 |
|---|---|---|
| `name` | ✅ | 스킬 고유 식별자 (폴더명과 일치 권장) |
| `description` | ✅ | 스킬 설명 (검색 및 트리거 판단에 사용) |
| `tags` | - | 태그 배열 (필터링용) |
| `version` | - | 버전 문자열 |
| `icon` | - | 이모지 아이콘 (없으면 첫 글자 자동 생성) |

---

## API 명세

백엔드가 실행 중이면 `http://localhost:8000/docs`에서 Swagger UI로 확인할 수 있습니다.

| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET` | `/api/skills` | 스킬 목록 조회 (`?q=검색어&tags=tag1`) |
| `GET` | `/api/skills/{name}` | 스킬 상세 (frontmatter + 본문) |
| `POST` | `/api/skills/{name}/test` | 트리거 테스트 |
| `POST` | `/api/sync` | 폴더 강제 재스캔 |
| `POST` | `/api/skills/{name}/open` | 에디터/폴더 열기 |

---

## 프로젝트 구조

```
skillhub/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI 앱 + lifespan
│   │   ├── config.py          # 환경 변수
│   │   ├── db.py              # SQLAlchemy 엔진
│   │   ├── models/skill.py    # Skill, TriggerTest ORM
│   │   ├── schemas/skill.py   # Pydantic 스키마
│   │   ├── routers/           # skills / sync / system
│   │   └── services/
│   │       ├── scanner.py     # SKILL.md 파싱 + DB 동기화
│   │       ├── watcher.py     # watchdog 파일 감시
│   │       └── trigger.py     # Anthropic API 호출
│   └── alembic/               # DB 마이그레이션
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # 스킬 라이브러리 홈
│   │   └── skills/[name]/     # 스킬 상세
│   ├── components/
│   │   ├── ui/                # Button, Chip, Input, Modal, Toast
│   │   ├── SkillCard.tsx
│   │   ├── SkillGrid.tsx
│   │   ├── TriggerTestModal.tsx
│   │   └── ...
│   └── lib/
│       ├── api.ts             # fetch 래퍼
│       ├── types.ts           # TypeScript 타입
│       └── format.ts          # Luxon 상대시간
├── scripts/seed.py            # 샘플 스킬 생성
├── docker-compose.yml
└── Makefile
```

---

## Makefile 명령어

```bash
make db-up          # PostgreSQL 컨테이너 시작
make db-down        # 컨테이너 중지
make migrate        # Alembic 마이그레이션 실행
make dev-backend    # 백엔드 개발 서버 (port 8000)
make dev-frontend   # 프론트엔드 개발 서버 (port 3000)
make install        # 백엔드 + 프론트엔드 의존성 설치
make seed           # 샘플 SKILL.md 3개 생성
make sync           # 폴더 강제 재스캔 API 호출
```

---

## 로드맵

| Phase | 내용 | 상태 |
|---|---|---|
| **Phase 1** | Storage + Registry + UI (현재) | ✅ 완료 |
| **Phase 1.5** | Monaco Editor 인라인 편집 | 예정 |
| **Phase 2** | Harness — 트리거 벤치마크 / 평가 대시보드 | 예정 |
| **Phase 3** | Agent 정의, 멀티유저, 인증 | 예정 |
| **Phase 4** | Workflow DAG, Stripe 결제 | 예정 |

---

## 라이선스

MIT
