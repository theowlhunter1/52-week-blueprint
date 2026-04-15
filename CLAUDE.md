# Blueprint

## What This Is
A React dashboard app that tracks a quarterly career development plan: $110K Head of AI → $200K+ Agent Engineer / AI Implementation. The plan (v4.0) is organized around four pillars: agent engineering & infrastructure, AI reliability & security, product delivery & portfolio, and income & market positioning. Learning is interleaved with building — every skill gap gets filled by building it into DroplightOS.

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
├── meta: { title, goal, version, created, updated, revision_notes }
├── settings: { startDate, theme }
├── quarters[2]: { id, name, theme, weeks, color, blocks[], milestones[] }
│   └── blocks[]: { id, title, week_range: [start, end], tasks[] }
│       └── tasks[]: { id, domain, title, description, status, priority, due_week, deferred_to_week, date_completed, notes[], links[] }
└── resources: {} (unused — retained for schema compatibility)
```

### Domains (6 — defined in `src/constants/domains.js`)
`build` | `learn` | `credentials` | `income` | `portfolio` | `community`

### Pillars (4 — defined in `src/constants/domains.js`)
`agent-engineering` | `ai-reliability` | `product-delivery` | `income-positioning`

### Task Statuses
`not_started` | `in_progress` | `completed` | `skipped` | `deferred`

### Task Priorities
`critical` | `high` | `normal`

### State Management (`src/context/PlanContext.jsx`)
Reducer actions: `SET_TASK_STATUS`, `DEFER_TASK`, `ADD_NOTE`, `UPDATE_SETTINGS`, `TOGGLE_MILESTONE`, `UPDATE_TASK`, `ADD_TASK`, `DELETE_TASK`, `MOVE_TASK`, `UPDATE_META`, `IMPORT_STATE`, `CLOSE_BLOCK`, `REOPEN_BLOCK`, `RESET`

State is auto-saved to localStorage with 300ms debounce. `RESET` action restores seedData defaults.

### Key Files
```
src/
├── App.jsx                          # Router + ThemeApplier + PlanProvider
├── constants/domains.js             # Single source of truth: domains, pillars, defaults, MAX_WEEK
├── context/PlanContext.jsx           # All state logic, reducer, localStorage
├── data/seedData.js                 # Plan content (v4.0 — quarterly agent engineering)
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.jsx             # Main view: progress ring, domain balance, week tasks
│   │   ├── ProgressRing.jsx          # SVG circular progress
│   │   ├── CurrentWeek.jsx           # Shows current week number
│   │   ├── QuarterBars.jsx           # Quarter completion bars (dynamic from state)
│   │   ├── ThisWeekTasks.jsx         # Tasks due this week
│   │   └── OverdueList.jsx           # Overdue tasks
│   ├── timeline/
│   │   ├── Timeline.jsx              # Full plan view by quarter
│   │   ├── QuarterSection.jsx        # Quarter accordion
│   │   ├── WeekBlock.jsx             # Week block with tasks
│   │   ├── TimelineProgressBar.jsx   # Schedule status bar
│   │   └── TaskRow.jsx               # Individual task row
│   ├── task/
│   │   ├── TaskDetailPanel.jsx       # Slide-out task detail
│   │   ├── TaskNotes.jsx             # Notes on a task
│   │   ├── DomainBadge.jsx           # Colored domain label (imports from constants)
│   │   └── TaskStatusBadge.jsx       # Status pill
│   ├── summary/ExecutiveSummary.jsx   # Narrative prose + week-by-week breakdown
│   ├── layout/
│   │   ├── MainLayout.jsx            # Shell with nav
│   │   └── Sidebar.jsx               # Sidebar navigation
│   └── settings/Settings.jsx         # Start date, theme, reset, import/export
├── hooks/useLocalStorage.js
└── utils/
    ├── weekCalculations.js           # getCurrentWeek(), getCompletionStats()
    ├── execFramingTemplates.js       # Pillar x domain framing templates
    └── exportData.js                 # JSON export/import
```

## Important Context
- **v4.0 (Apr 2026)**: Complete rework from 52-week CAIO study plan to quarterly agent engineering plan. Driven by reality: spent 9 weeks building DroplightOS (152 PRs, 47 DB models, production infrastructure) instead of following the study plan. New approach: build-first (learn by shipping), quarterly cadence (12 weeks detailed, 12 weeks sketch, re-evaluate), new domains (build/learn/credentials/income/portfolio/community).
- **v3.0 (Feb 2026)**: Prior version — 52-week CAIO credential/governance plan with 4-quarter cert spine.
- **localStorage matters**: Editing seedData.js only affects new users or after a Reset. Existing users must Reset in Settings to pick up seed changes.
- **User profile**: Non-traditional background (church planting → family office AI → agent engineering). Currently $110K Head of AI, targeting $200K+ via AI implementation services or full-time AI engineering role. Learns by building, not reading.
- **42 tasks** across 2 quarters, 9 week-blocks. Task IDs: t001–t042.
- **Certification**: AIGP on the table for Q1. Additional certs evaluated at end of each quarter based on market direction.
- **DroplightOS**: Production M&A platform (the "BUILD" project). 47 DB models, real auth/AI/storage, Gemini + Together AI, 5 cron jobs.

## Commands
```bash
npm run dev    # Start dev server
npm run build  # Production build (output: dist/)
npm run lint   # ESLint
```
