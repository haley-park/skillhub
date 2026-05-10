# 🧠 Skillhub

**Local AI Skill Hub** — A personal tool for managing and testing your Anthropic SKILL.md files in one place.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)

---

## Preview

### Skill Library Home
![Home](docs/preview-home.svg)

### Skill Detail Page
![Detail](docs/preview-detail.svg)

### Trigger Test Modal
![Trigger Test](docs/preview-trigger.svg)

---

## Architecture

![Architecture](docs/architecture.svg)

**Core Principles**
- **File as source of truth** — SKILL.md on disk is the canonical record. DB is an index/cache.
- **Auto-detection via watchdog** — Changes in `~/skillhub/skills/` appear in the UI within 2 seconds.
- **Local single-user** — No auth. localhost only.

---

## Claude Commands Integration

Skillhub automatically picks up skills from both your skill library and your Claude Code commands directory.

```
~/.claude/commands/new-skill.md  (save here)
          ↓  (auto-detected by watchdog)
  Skillhub UI — card appears instantly
          ↓
  Claude Code  /new-skill  command also works
```

**How it works:**

1. Save a `.md` file with YAML frontmatter to `~/.claude/commands/`
2. Skillhub's watchdog detects the change and syncs automatically
3. The skill appears as a card in the UI
4. The same file is usable as a `/command` in Claude Code

**Example — `~/.claude/commands/pdf-extraction.md`:**

```markdown
---
name: pdf-extraction
description: Extracts text and tables from PDF files. Handles multi-column layouts and scanned PDFs.
tags: [pdf, document, extraction]
version: 1.0.0
icon: "📄"
---

# PDF Extraction Skill

Your skill content here...
```

You can also link skills bidirectionally via symlinks:

```bash
# Make ~/.claude/skills/ point to your Skillhub library
ln -s ~/skillhub/skills ~/.claude/skills

# Link a command into your skill library
ln -s ~/.claude/commands/pdf-extraction.md ~/skillhub/skills/pdf-extraction.md
```

---

## Features

| Feature | Description |
|---|---|
| Skill Library | Auto-scan SKILL.md files · card grid · search · tag filter |
| Real-time Sync | watchdog file watching + 5s polling — no page refresh needed |
| Trigger Test | Enter a user message → Anthropic API judges if the skill is triggered |
| Editor Integration | Open SKILL.md directly in VSCode or your default editor |
| Toss-style UI | Pretendard font, Framer Motion animations, responsive layout |

---

## Tech Stack

### Backend
| Package | Version | Role |
|---|---|---|
| FastAPI | 0.115 | REST API server |
| SQLAlchemy | 2.0 (typed) | ORM / DB index |
| PostgreSQL | 16 | Metadata storage |
| Alembic | 1.13 | DB migrations |
| watchdog | 6.0 | File system watching |
| python-frontmatter | 1.1 | YAML frontmatter parsing |
| anthropic | 0.40+ | Trigger detection API |

### Frontend
| Package | Version | Role |
|---|---|---|
| Next.js | 15.1 (App Router) | Routing, SSR |
| React | 19 | UI components |
| TypeScript | 5.7 (strict) | Type safety |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 12 | Animations |
| Luxon | 3 | Relative time display |
| react-markdown | 9 | Markdown rendering |

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+ + pnpm
- PostgreSQL (local install or Docker)

### 1. Clone the repository

```bash
git clone https://github.com/haley-park/skillhub.git
cd skillhub
```

### 2. Set up environment variables

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in your Anthropic API key:

```env
DATABASE_URL=postgresql+psycopg2://postgres:yourpassword@localhost:5432/skillhub
SKILLS_DIR=~/skillhub/skills
COMMANDS_DIR=~/.claude/commands
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6
```

```bash
cp frontend/.env.local.example frontend/.env.local
```

### 3. Install dependencies

```bash
make install
```

### 4. Run DB migration

```bash
make migrate
```

### 5. Create sample skills (optional)

```bash
make seed
```

This generates 3 sample SKILL.md files in `~/skillhub/skills/`.

### 6. Start servers

Open two terminals:

```bash
# Terminal 1 — Backend
make dev-backend

# Terminal 2 — Frontend
make dev-frontend
```

Visit **http://localhost:3000**.

---

## Writing a SKILL.md

Create a file at `~/skillhub/skills/<folder>/SKILL.md` or `~/.claude/commands/<name>.md` — it will be registered automatically.

```markdown
---
name: pdf-extraction
description: Extracts text and tables from PDF files.
tags: [pdf, document, extraction]
version: 1.0.0
icon: "📄"
---

# PDF Extraction Skill

Your skill body in Markdown...
```

| Field | Required | Description |
|---|---|---|
| `name` | ✅ | Unique skill identifier (recommend matching folder name) |
| `description` | ✅ | Skill description (used for search and trigger detection) |
| `tags` | - | Tag array (for filtering) |
| `version` | - | Version string |
| `icon` | - | Emoji icon (first letter used as fallback) |

---

## API Reference

With the backend running, visit `http://localhost:8000/docs` for the Swagger UI.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/skills` | List skills (`?q=query&tags=tag1`) |
| `GET` | `/api/skills/{name}` | Skill detail (frontmatter + body) |
| `POST` | `/api/skills/{name}/test` | Trigger test |
| `POST` | `/api/sync` | Force re-scan of skill directories |
| `POST` | `/api/skills/{name}/open` | Open in editor or folder |

---

## Project Structure

```
skillhub/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app + lifespan
│   │   ├── config.py          # Environment variables
│   │   ├── db.py              # SQLAlchemy engine
│   │   ├── models/skill.py    # Skill, TriggerTest ORM
│   │   ├── schemas/skill.py   # Pydantic schemas
│   │   ├── routers/           # skills / sync / system
│   │   └── services/
│   │       ├── scanner.py     # SKILL.md parsing + DB sync
│   │       ├── watcher.py     # watchdog file watching
│   │       └── trigger.py     # Anthropic API call
│   └── alembic/               # DB migrations
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Skill library home
│   │   └── skills/[name]/     # Skill detail
│   ├── components/
│   │   ├── ui/                # Button, Chip, Input, Modal, Toast
│   │   ├── SkillCard.tsx
│   │   ├── SkillGrid.tsx
│   │   ├── TriggerTestModal.tsx
│   │   └── ...
│   └── lib/
│       ├── api.ts             # Fetch wrappers
│       ├── types.ts           # TypeScript types
│       └── format.ts          # Luxon relative time
├── scripts/seed.py            # Sample skill generator
└── Makefile
```

---

## Makefile Commands

```bash
make migrate        # Run Alembic migrations
make dev-backend    # Backend dev server (port 8000)
make dev-frontend   # Frontend dev server (port 3000)
make install        # Install backend + frontend dependencies
make seed           # Generate 3 sample SKILL.md files
make sync           # Force re-scan via API
```

---

## Roadmap

| Phase | Description | Status |
|---|---|---|
| **Phase 1** | Storage + Registry + UI (current) | ✅ Done |
| **Phase 1.5** | Monaco Editor inline editing | Planned |
| **Phase 2** | Harness — trigger benchmarks / evaluation dashboard | Planned |
| **Phase 3** | Agent definitions, multi-user, auth | Planned |
| **Phase 4** | Workflow DAG, billing | Planned |

---

## License

MIT
