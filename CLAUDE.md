# 52-Week Blueprint

## What This Is
A React dashboard app that tracks a 52-week career transition plan: $95K Head of AI → $250K+ CAIO/VP of AI. The plan (v3.0) is organized around four pillars: governance & risk, strategy & transformation, systems & platforms, and fractional CAIO & executive positioning. A structured certification spine runs through the year: AIGP (Q1) → Google Cloud Gen-AI Leader (Q2) → NVIDIA NCP-AAI (Q3) → AWS (Q4).

## Tech Stack
- React 19 + Vite 7 + Tailwind CSS 4 + Recharts
- React Router (4 routes: Dashboard `/`, Timeline `/timeline`, Executive Summary `/summary`, Settings `/settings`)
- State: `useReducer` + localStorage persistence (key: `blueprint-52-week`)
- Deployed on Vercel

## Architecture

### Data Model (`src/data/seedData.js`)
The seed data is the single source of truth for plan content. Structure:
```
seedData
├── meta: { title, goal, version, created }
├── settings: { startDate, theme }
├── quarters[4]: { id, name, theme, weeks, color, blocks[], milestones[] }
│   └── blocks[]: { id, title, week_range: [start, end], tasks[] }
│       └── tasks[]: { id, domain, title, description, status, priority, due_week, deferred_to_week, date_completed, notes[], links[] }
└── resources: { books[], certifications[], courses[], podcasts[], conferences[], execEducation[], fractionalPlatforms[] }
```

### Domains (6 fixed — used in UI filtering and badges)
`technical` | `strategy` | `leadership` | `credentials` | `networking` | `portfolio`

### Task Statuses
`not_started` | `in_progress` | `completed` | `skipped` | `deferred`

### Task Priorities
`critical` | `high` | `normal`

### State Management (`src/context/PlanContext.jsx`)
Reducer actions: `SET_TASK_STATUS`, `DEFER_TASK`, `ADD_NOTE`, `UPDATE_SETTINGS`, `TOGGLE_MILESTONE`, `UPDATE_TASK`, `ADD_TASK`, `DELETE_TASK`, `MOVE_TASK`, `UPDATE_META`, `IMPORT_STATE`, `RESET`

State is auto-saved to localStorage with 300ms debounce. `RESET` action restores seedData defaults.

### Key Files
```
src/
├── App.jsx                          # Router + ThemeApplier + PlanProvider
├── context/PlanContext.jsx           # All state logic, reducer, localStorage
├── data/seedData.js                  # Plan content (v3.0 — four pillars + cert spine)
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.jsx             # Main view: progress ring, domain balance, week tasks
│   │   ├── ProgressRing.jsx          # SVG circular progress
│   │   ├── CurrentWeek.jsx           # Shows current week number
│   │   ├── QuarterBars.jsx           # Quarter completion bars
│   │   ├── ThisWeekTasks.jsx         # Tasks due this week
│   │   └── OverdueList.jsx           # Overdue tasks
│   ├── timeline/
│   │   ├── Timeline.jsx              # Full plan view by quarter
│   │   ├── QuarterSection.jsx        # Quarter accordion
│   │   ├── WeekBlock.jsx             # Week block with tasks
│   │   └── TaskRow.jsx               # Individual task row
│   ├── task/
│   │   ├── TaskDetailPanel.jsx       # Slide-out task detail
│   │   ├── TaskNotes.jsx             # Notes on a task
│   │   ├── DomainBadge.jsx           # Colored domain label
│   │   └── TaskStatusBadge.jsx       # Status pill
│   ├── summary/ExecutiveSummary.jsx   # Narrative prose + week-by-week breakdown
│   ├── layout/
│   │   ├── MainLayout.jsx            # Shell with nav
│   │   └── Sidebar.jsx               # Sidebar navigation
│   └── settings/Settings.jsx         # Start date, theme, reset, import/export
├── hooks/useLocalStorage.js
└── utils/
    ├── weekCalculations.js           # getCurrentWeek(), getCompletionStats()
    └── exportData.js                 # JSON export/import
```

## Important Context
- **v3.0 (Feb 2026)**: Restructured cert spine across all 4 quarters (AIGP Q1 → Gen-AI Leader Q2 → NCP-AAI Q3 → AWS Q4). Added Google Cloud Gen-AI Leader and AWS certs. Added AI Governance Charter and Risk Register as Q1 deliverables. Reframed around four pillars: governance & risk, strategy & transformation, systems & platforms, fractional CAIO & executive positioning. Split Q1 weeks 5–8 into two blocks.
- **v2.0 (Feb 2026)**: Earlier rewrite from traditional ML/Python/AWS path → governance + fractional CAIO + orchestration. Driven by Compass analysis showing ~40% of original plan was wasted effort given AI capability shifts.
- **localStorage matters**: Editing seedData.js only affects new users or after a Reset. Existing users must Reset in Settings to pick up seed changes.
- **User profile**: Non-traditional background (church planting → family office AI → CAIO). The plan leverages this as a strength, not a weakness.
- **78 tasks** across 4 quarters, 18 week-blocks. Task IDs: t001–t078.
- **Certification spine**: IAPP AIGP (Q1 w7–8) → Google Cloud Gen-AI Leader (Q2 w22–24) → NVIDIA NCP-AAI (Q3 w31–34) → AWS AI/Architecture (Q4 w44–47).
- **Fractional CAIO** is the primary income vehicle (2–3 clients at $8K–$10K/month = $192K–$360K/yr).

## Commands
```bash
npm run dev    # Start dev server
npm run build  # Production build (output: dist/)
npm run lint   # ESLint
```
