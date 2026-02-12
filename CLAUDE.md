# 52-Week Blueprint

## What This Is
A React dashboard app that tracks a 52-week career transition plan: $95K Head of AI → $250K+ CAIO/VP of AI. The plan is built around governance credentials (IAPP AIGP), fractional CAIO work, multi-agent orchestration skills (MCP/A2A), and executive education — NOT traditional Python/ML/AWS certification paths (those were cut in v2.0).

## Tech Stack
- React 19 + Vite 7 + Tailwind CSS 4 + Recharts
- React Router (3 routes: Dashboard `/`, Timeline `/timeline`, Settings `/settings`)
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
├── data/seedData.js                  # Plan content (v2.0 — governance/orchestration focus)
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
│   ├── layout/MainLayout.jsx         # Shell with nav
│   └── settings/Settings.jsx         # Start date, theme, reset, import/export
├── hooks/useLocalStorage.js
└── utils/
    ├── weekCalculations.js           # getCurrentWeek(), getCompletionStats()
    └── exportData.js                 # JSON export/import
```

## Important Context
- **v2.0 (Feb 2026)**: Complete rewrite of plan content from traditional ML/Python/AWS path → governance + fractional CAIO + orchestration. Driven by Compass analysis showing ~40% of original plan was wasted effort given AI capability shifts (Claude Opus 4.6, agentic coding, EU AI Act Aug 2026).
- **localStorage matters**: Editing seedData.js only affects new users or after a Reset. Existing users must Reset in Settings to pick up seed changes.
- **User profile**: Non-traditional background (church planting → family office AI → CAIO). The plan leverages this as a strength, not a weakness.
- **77 tasks** across 4 quarters, 18 week-blocks. Task IDs: t001–t077.
- **Fractional CAIO** is the primary income vehicle (2–3 clients at $8K–$10K/month = $192K–$360K/yr).

## Commands
```bash
npm run dev    # Start dev server
npm run build  # Production build (output: dist/)
npm run lint   # ESLint
```
