# Adaptive Timeline, Work Tasks & Progress Bar

**Date:** 2026-02-26
**Status:** Design
**Version:** 1.0

---

## Problem Statement

The 52-week blueprint has fixed week-block date ranges derived from `startDate`. When tasks are completed ahead of schedule, the timeline doesn't reflect that progress — blocks still show their original dates. Additionally, there's no way to add work-related tasks that tie into the career plan, forcing the user to track work separately. The timeline page also lacks a top-level progress indicator showing overall plan health.

## Goals

1. **Adaptive schedule**: Allow manual block close-out that cascades date shifts forward, accumulating buffer at the end of the year.
2. **Inline work tasks**: Add work-related tasks directly into week-blocks with a "Plan Connection" system that generates exec-ready framing narratives.
3. **Timeline progress bar**: Show overall plan completion and schedule pace at the top of the Timeline page.

## Non-Goals

- No AI/LLM integration (all narrative generation is template-based)
- No changes to the Dashboard or Executive Summary pages
- No calendar sync or external integrations
- No automatic block closing (manual only)

---

## Feature 1: Adaptive Timeline with Block Close-out

### Behavior

- Each `WeekBlock` gets a **"Close Block"** button visible when the block is expanded.
- Clicking "Close Block" records the current date as `closed_date` on that block.
- The **next block's start date** shifts to: `closed_date + 1 day` (if earlier than original).
- This cascades through all subsequent blocks. End dates shift proportionally (preserving each block's original duration in weeks).
- The overall 52-week end date stays fixed. Early close-outs accumulate as buffer.
- A **"Reopen Block"** button appears on closed blocks.
- Closed blocks get a visual treatment: muted styling with a "Closed" badge and the actual close date.

### Date Calculation Logic

```
function getAdaptiveBlockDates(allBlocks, startDate):
  let nextStart = null

  for each block in allBlocks (ordered by week_range):
    originalStart = getWeekDate(startDate, block.week_range[0])
    originalEnd   = getWeekDate(startDate, block.week_range[1]) + 6 days
    duration      = originalEnd - originalStart  (in ms)

    if nextStart is not null AND nextStart < originalStart:
      adaptiveStart = nextStart
    else:
      adaptiveStart = originalStart

    adaptiveEnd = adaptiveStart + duration

    if block.closed AND block.closed_date:
      closedDate = parse(block.closed_date)
      nextStart  = closedDate + 1 day
    else:
      nextStart  = adaptiveEnd + 1 day

    yield { blockId, adaptiveStart, adaptiveEnd, originalStart, originalEnd }
```

Key rules:
- A block can never start **later** than its original date (no penalty for slow blocks — the original schedule is a floor).
- Wait — actually, if a previous block takes longer, the next block should NOT auto-delay. The user controls this via "Close Block." If a block is not closed, subsequent blocks keep their original dates. Only closing early cascades benefit forward.
- If a block is reopened, recalculate from that point — subsequent blocks revert to max(cascaded, original).

### Data Model Change

Add to each block object:
```js
block.closed       // boolean, default false
block.closed_date  // ISO string | null, default null
```

### Reducer Actions

**`CLOSE_BLOCK`**
```js
case 'CLOSE_BLOCK': {
  const { blockId } = action.payload;
  const now = new Date().toISOString();
  return {
    ...state,
    quarters: state.quarters.map(q => ({
      ...q,
      blocks: q.blocks.map(b =>
        b.id === blockId
          ? { ...b, closed: true, closed_date: now }
          : b
      ),
    })),
  };
}
```

**`REOPEN_BLOCK`**
```js
case 'REOPEN_BLOCK': {
  const { blockId } = action.payload;
  return {
    ...state,
    quarters: state.quarters.map(q => ({
      ...q,
      blocks: q.blocks.map(b =>
        b.id === blockId
          ? { ...b, closed: false, closed_date: null }
          : b
      ),
    })),
  };
}
```

### UI Changes

**WeekBlock.jsx** — Button area (inside expanded content, below task list):

```
┌─────────────────────────────────────────────────────┐
│ ▸ Weeks 1–2: Baseline and Brand Relaunch            │
│   Feb 25 – Feb 28 (originally Mar 10)    [Closed ✓] │
│                                              6/6    │
│   ├─ ☑ Book and begin IAPP AIGP exam prep           │
│   ├─ ☑ Document all AI projects...                  │
│   ├─ ...                                            │
│   │                                                 │
│   │  [Reopen Block]                                 │
│   └─ + Add Task                                     │
└─────────────────────────────────────────────────────┘
```

For an open (not yet closed) block:
```
│   │  [Close Block ✓]          (appears when expanded) │
│   └─ + Add Task                                       │
```

**Visual treatment for closed blocks:**
- Border becomes dashed or uses `border-status-completed/30`
- Block header shows adaptive end date with "(originally {date})" if different
- "Closed" pill badge (green) next to the completion count
- Tasks remain visible but the block has a subtle completed feel

### Backward Compatibility

Existing localStorage data has no `closed` or `closed_date` on blocks. Code treats missing values as `false`/`null` — no migration needed.

---

## Feature 2: Inline Work Tasks with Plan Connection

### Behavior

- The existing "Add Task" form in `WeekBlock` gets a **"Work Task" toggle**.
- When toggled, the form expands with two additional fields:
  - **Plan Pillar** dropdown (required for work tasks)
  - **Freeform narrative** textarea (optional)
- On save, the task gets `work: true` plus the pillar and narrative fields.
- An **auto-generated exec framing** string is produced from a pillar x domain template matrix and stored on the task.
- Work tasks display an **amber "Work" badge** in `TaskRow` and `TaskDetailPanel`.
- The `TaskDetailPanel` shows a **"Plan Connection"** section for work tasks.

### Data Model Change

Add to task objects (work tasks only):
```js
task.work            // boolean, default false (absent on plan tasks)
task.plan_pillar     // string: "governance-risk" | "strategy-transformation" |
                     //         "systems-platforms" | "fractional-exec"
task.exec_framing    // string, auto-generated from template
task.plan_narrative  // string, user-written freeform text
```

### Plan Pillar Definitions

| Key                        | Label                                  |
|----------------------------|----------------------------------------|
| `governance-risk`          | Governance & Risk                      |
| `strategy-transformation`  | Strategy & Transformation              |
| `systems-platforms`        | Systems & Platforms                    |
| `fractional-exec`          | Fractional CAIO & Executive Positioning|

### Exec Framing Templates

Templates are stored in a new utility file: `src/utils/execFramingTemplates.js`

Each template is keyed by `{pillar}_{domain}` and follows the format:

```
"This work directly strengthens your {PILLAR_LABEL} pillar.
Present to leadership as: {DOMAIN_SPECIFIC_FRAMING}.
Portfolio angle: {PORTFOLIO_ANGLE}."
```

#### Template Matrix (24 combinations: 4 pillars x 6 domains)

**governance-risk + technical:**
> "This work directly strengthens your Governance & Risk pillar. Present to leadership as: hands-on AI governance and risk management implementation, demonstrating the technical controls and safety protocols that AIGP-certified leaders deliver. Portfolio angle: reference in your AI Governance Framework as a real-world case study of applied risk controls."

**governance-risk + strategy:**
> "This work directly strengthens your Governance & Risk pillar. Present to leadership as: strategic AI risk assessment and policy development, demonstrating the governance thinking that boards and regulators expect from AI leaders. Portfolio angle: incorporate into your AI Governance Charter and Risk Register as evidence of strategic risk governance."

**governance-risk + leadership:**
> "This work directly strengthens your Governance & Risk pillar. Present to leadership as: cross-functional AI governance leadership, demonstrating ability to drive organizational compliance and accountability. Portfolio angle: add to your fractional CAIO engagement narrative as evidence of governance leadership in practice."

**governance-risk + credentials:**
> "This work directly strengthens your Governance & Risk pillar. Present to leadership as: applied governance expertise that validates your AIGP certification, demonstrating real-world mastery beyond the exam. Portfolio angle: cite as practical evidence alongside your AIGP credential."

**governance-risk + networking:**
> "This work directly strengthens your Governance & Risk pillar. Present to leadership as: AI governance community engagement and stakeholder management, building the cross-functional relationships that effective governance requires. Portfolio angle: reference in conversations with search firms as evidence of governance-in-practice."

**governance-risk + portfolio:**
> "This work directly strengthens your Governance & Risk pillar. Present to leadership as: documented governance artifacts with measurable compliance outcomes. Portfolio angle: publish (scrubbed) as an open-source template or case study demonstrating governance maturity."

**strategy-transformation + technical:**
> "This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: technical execution that directly supports AI transformation objectives, demonstrating ability to bridge strategy and implementation. Portfolio angle: document architecture decisions and business impact for your AI Transformation Playbook."

**strategy-transformation + strategy:**
> "This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: strategic AI initiative design that drives measurable business outcomes, demonstrating the ROI-focused thinking that CAIO roles demand. Portfolio angle: incorporate into your Board-Ready AI Strategy deck as a proven initiative."

**strategy-transformation + leadership:**
> "This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: change management and organizational alignment for AI adoption, demonstrating the transformation leadership that differentiates senior AI executives. Portfolio angle: add to your AI Transformation Playbook as a change management case study."

**strategy-transformation + credentials:**
> "This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: applied strategic expertise that validates your certifications with demonstrated impact. Portfolio angle: cite as evidence that credentials translate to business outcomes."

**strategy-transformation + networking:**
> "This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: stakeholder engagement and executive communication around AI transformation, building the internal champions that successful AI programs require. Portfolio angle: reference in exec-ed conversations and LinkedIn posts about transformation lessons learned."

**strategy-transformation + portfolio:**
> "This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: documented transformation artifacts with measurable outcomes. Portfolio angle: add as a case study in your Enterprise AI Strategy Roadmap template."

**systems-platforms + technical:**
> "This work directly strengthens your Systems & Platforms pillar. Present to leadership as: hands-on AI systems architecture and platform engineering, demonstrating the builder credibility that complements your governance and strategy credentials. Portfolio angle: document as a technical case study for your GitHub portfolio and NCP-AAI credential evidence."

**systems-platforms + strategy:**
> "This work directly strengthens your Systems & Platforms pillar. Present to leadership as: platform strategy and build-vs-buy decision-making that optimizes AI infrastructure spend. Portfolio angle: incorporate into your Inference Economics Model as a real-world cost and architecture analysis."

**systems-platforms + leadership:**
> "This work directly strengthens your Systems & Platforms pillar. Present to leadership as: technical team leadership and platform governance, demonstrating ability to lead engineering teams on AI infrastructure decisions. Portfolio angle: add to your career narrative as evidence of hands-on technical leadership."

**systems-platforms + credentials:**
> "This work directly strengthens your Systems & Platforms pillar. Present to leadership as: applied platform expertise validating your cloud and architecture certifications (Gen-AI Leader, NCP-AAI, AWS). Portfolio angle: cite as practical evidence alongside your credential spine."

**systems-platforms + networking:**
> "This work directly strengthens your Systems & Platforms pillar. Present to leadership as: vendor and partner relationship management for AI platform decisions. Portfolio angle: reference in your enterprise AI vendor evaluation framework."

**systems-platforms + portfolio:**
> "This work directly strengthens your Systems & Platforms pillar. Present to leadership as: documented system architecture with performance metrics and business impact. Portfolio angle: publish architecture diagrams and outcomes in your GitHub portfolio."

**fractional-exec + technical:**
> "This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: hands-on technical execution that demonstrates you're a builder-leader, not just a strategist — the profile that hiring committees and fractional clients value most. Portfolio angle: use as client-facing case study in your engagement packages."

**fractional-exec + strategy:**
> "This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: strategic AI advisory work with measurable business impact, directly demonstrating the value proposition of your fractional CAIO engagement packages. Portfolio angle: add to your AI Value Rescue or AI Strategy Fast-Track engagement evidence."

**fractional-exec + leadership:**
> "This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: executive-level AI leadership demonstrating board-ready communication, team building, and organizational transformation. Portfolio angle: reference in search firm conversations and your career narrative document."

**fractional-exec + credentials:**
> "This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: practical application of your credential stack (AIGP + Gen-AI Leader + NCP-AAI + AWS), proving that certifications translate to real organizational impact. Portfolio angle: cite in LinkedIn posts connecting credentials to outcomes."

**fractional-exec + networking:**
> "This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: relationship building and executive network expansion that directly supports your CAIO trajectory. Portfolio angle: leverage these connections for warm introductions to fractional CAIO prospects and full-time opportunities."

**fractional-exec + portfolio:**
> "This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: documented executive deliverables demonstrating CAIO-caliber output. Portfolio angle: add as a capstone artifact to your personal site and use in interview prep narratives."

### Template Utility Function

```js
// src/utils/execFramingTemplates.js

const TEMPLATES = { /* all 24 templates keyed by "{pillar}_{domain}" */ };

const PILLAR_LABELS = {
  'governance-risk': 'Governance & Risk',
  'strategy-transformation': 'Strategy & Transformation',
  'systems-platforms': 'Systems & Platforms',
  'fractional-exec': 'Fractional CAIO & Executive Positioning',
};

export function generateExecFraming(pillar, domain) {
  const key = `${pillar}_${domain}`;
  return TEMPLATES[key] || `This work connects to your ${PILLAR_LABELS[pillar] || pillar} pillar.`;
}

export { PILLAR_LABELS };
```

### Reducer Change: Modify `ADD_TASK`

```js
case 'ADD_TASK': {
  const { blockId, task } = action.payload;
  const newTask = {
    id: `custom-${Date.now()}`,
    domain: 'technical',
    status: 'not_started',
    priority: 'normal',
    deferred_to_week: null,
    date_completed: null,
    notes: [],
    links: [],
    custom: true,
    ...task,
  };

  // Auto-generate exec framing for work tasks
  if (newTask.work && newTask.plan_pillar) {
    newTask.exec_framing = generateExecFraming(newTask.plan_pillar, newTask.domain);
  }

  return {
    ...state,
    quarters: state.quarters.map(q => ({
      ...q,
      blocks: q.blocks.map(b =>
        b.id === blockId ? { ...b, tasks: [...b.tasks, newTask] } : b
      ),
    })),
  };
}
```

### UI Changes

**WeekBlock.jsx — Extended Add Task form:**

When "Work Task" toggle is on:

```
┌─ Add Task ──────────────────────────────────────────┐
│  Title: [____________________________________]      │
│                                                     │
│  Domain: [Technical ▾]    ☐ Work Task               │
│                                                     │
│  ── Work Task Fields (visible when toggled) ──────  │
│  Plan Pillar: [Governance & Risk              ▾]    │
│  Narrative:   [________________________________]    │
│               [________________________________]    │
│                                                     │
│                          [Cancel]  [Add]            │
└─────────────────────────────────────────────────────┘
```

**TaskRow.jsx — Work badge:**

```
│ ☐ [Technical] [Work] Build internal AI policy doc   │
```

Amber/orange badge: `bg-amber-500/20 text-amber-400`

**TaskDetailPanel.jsx — Plan Connection section:**

Appears between Description and Move to Week, only for work tasks:

```
┌─ PLAN CONNECTION ───────────────────────────────────┐
│  Pillar: [Governance & Risk]  (editable dropdown)   │
│                                                     │
│  Exec Framing:                                      │
│  ┌─────────────────────────────────────────────────┐│
│  │ "This work directly strengthens your Governance ││
│  │ & Risk pillar. Present to leadership as: hands- ││
│  │ on AI governance implementation..."             ││
│  └─────────────────────────────────────────────────┘│
│  [↻ Regenerate]                                     │
│                                                     │
│  My Narrative:                                      │
│  ┌─────────────────────────────────────────────────┐│
│  │ (click to edit — your own framing)              ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

"Regenerate" button re-runs `generateExecFraming()` with current pillar + domain — useful if the user changes the domain after creation.

### Backward Compatibility

Existing tasks have no `work`, `plan_pillar`, `exec_framing`, or `plan_narrative` fields. They render exactly as before. New fields only appear when `task.work === true`.

---

## Feature 3: Timeline Progress Bar

### Behavior

A sticky progress bar sits at the top of the Timeline page, between the header and the quarter sections. It shows two rows of information.

### Layout

```
┌─────────────────────────────────────────────────────┐
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Q1 (gold)  Q2 (blue)     Q3 (purple)   Q4 (green) │
│                                                     │
│  23/78 tasks (29%)          2 weeks ahead · 4/18    │
│                             blocks closed           │
└─────────────────────────────────────────────────────┘
```

### Component: `TimelineProgressBar.jsx`

New file: `src/components/timeline/TimelineProgressBar.jsx`

Props (derived from state in `Timeline.jsx`):
- `quarters` — full quarter data (to compute per-quarter stats)
- `allBlocks` — flat list of all blocks (to compute close-out data)
- `startDate` — for date calculations

### Schedule Status Calculation

New utility function in `weekCalculations.js`:

```js
export function getScheduleStatus(allBlocks, startDate) {
  const now = new Date();
  let bufferDays = 0;
  let closedCount = 0;

  for (const block of allBlocks) {
    if (block.closed && block.closed_date) {
      closedCount++;
      const originalEnd = getWeekDate(startDate, block.week_range[1]);
      originalEnd.setDate(originalEnd.getDate() + 6);
      const closedDate = new Date(block.closed_date);
      const diff = Math.floor((originalEnd - closedDate) / (1000 * 60 * 60 * 24));
      if (diff > 0) bufferDays += diff;
    }
  }

  const totalBlocks = allBlocks.length;
  const weeksAhead = Math.floor(bufferDays / 7);

  let label;
  if (weeksAhead > 0) label = `${weeksAhead} week${weeksAhead > 1 ? 's' : ''} ahead`;
  else if (bufferDays > 0) label = `${bufferDays} days ahead`;
  else label = 'On track';

  return { bufferDays, weeksAhead, closedCount, totalBlocks, label };
}
```

### Progress Bar Segments

Each quarter gets a proportional segment of the bar based on its task count:
- Q1: 26/78 = 33.3%
- Q2: 19/78 = 24.4%
- Q3: 18/78 = 23.1%
- Q4: 15/78 = 19.2%

Within each segment, the fill represents that quarter's completion percentage. Uses existing `quarter.color` for fill.

### Sticky Behavior

```jsx
<div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-sm border-b border-border pb-4 mb-6">
  <TimelineProgressBar ... />
</div>
```

---

## Files Changed Summary

### New Files
| File | Purpose |
|------|---------|
| `src/utils/execFramingTemplates.js` | Template matrix + `generateExecFraming()` |
| `src/components/timeline/TimelineProgressBar.jsx` | Sticky progress bar component |

### Modified Files
| File | Changes |
|------|---------|
| `src/context/PlanContext.jsx` | Add `CLOSE_BLOCK`, `REOPEN_BLOCK` actions; modify `ADD_TASK` for work task fields + exec framing |
| `src/utils/weekCalculations.js` | Add `getAdaptiveBlockDates()`, `getScheduleStatus()` |
| `src/components/timeline/Timeline.jsx` | Add `TimelineProgressBar`; pass adaptive dates |
| `src/components/timeline/WeekBlock.jsx` | Add Close/Reopen Block button; use adaptive dates; extend Add Task form with work task fields |
| `src/components/timeline/TaskRow.jsx` | Add amber "Work" badge |
| `src/components/task/TaskDetailPanel.jsx` | Add "Plan Connection" section for work tasks |

### Unchanged Files
| File | Reason |
|------|--------|
| `src/data/seedData.js` | No seed data changes — new fields default at runtime |
| `src/components/dashboard/*` | Dashboard unchanged |
| `src/components/summary/*` | Executive Summary unchanged |
| `src/components/settings/*` | Settings unchanged |

---

## Backward Compatibility

All new fields use falsy defaults:
- `block.closed` → `undefined`/`false` → treated as open
- `block.closed_date` → `undefined`/`null` → no adaptive shift
- `task.work` → `undefined`/`false` → renders as normal task
- `task.plan_pillar` → `undefined` → no Plan Connection section
- `task.exec_framing` → `undefined` → no exec framing displayed
- `task.plan_narrative` → `undefined` → no narrative displayed

Existing localStorage data loads and renders identically to current behavior. No migration step required.

---

## Implementation Order

1. **Data layer first**: Reducer actions (`CLOSE_BLOCK`, `REOPEN_BLOCK`), utility functions (`getAdaptiveBlockDates`, `getScheduleStatus`), exec framing templates
2. **Progress bar**: `TimelineProgressBar` component + integration in `Timeline.jsx`
3. **Block close-out UI**: Close/Reopen buttons in `WeekBlock`, adaptive date display
4. **Work tasks**: Extended Add Task form, Work badge in `TaskRow`, Plan Connection in `TaskDetailPanel`
5. **Polish**: Verify backward compat, test with existing localStorage data, visual refinement
