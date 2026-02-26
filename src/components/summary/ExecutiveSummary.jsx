import { usePlan } from '../../context/PlanContext';

/**
 * Success metrics per block id — executive-summary style deliverables.
 * Kept in sync with plan; update when blocks change.
 */
const BLOCK_SUCCESS_METRICS = {
  'q1-w1-2': 'AIGP exam date booked; structured study schedule in place; LinkedIn updated; first positioning post live; 10 AI/data/governance leaders connected.',
  'q1-w3-4': '3–5 case studies drafted; at least one exec-ed application submitted (or deliberate decision not to); 2–3 posts/week cadence locked.',
  'q1-w5-6': 'AIGP content 70–80% complete; one full practice exam done; Governance Charter v0.1 and populated Risk Register completed.',
  'q1-w7-8': 'AIGP passed (or exam taken with retake plan); 3 engagement packages drafted; at least 1 case study refined and ready to share.',
  'q1-w9-10': 'AI Strategy Brief v0.1 completed and shared internally; Gen-AI Leader exam blueprint reviewed; study plan laid out.',
  'q1-w11-13': '1 serious fractional CAIO discussion (verbal or LOI-ish); 3 search firms/exec recruiters contacted with updated narrative.',
  'q2-w14-17': 'Exec-ed started or declined intentionally; inference economics spreadsheet built; agent ROI framework drafted; Gen-AI Leader practice questions started.',
  'q2-w18-21': 'Gen-AI architecture and business case doc done; AI Governance Framework drafted; Agent Workforce Playbook started; first fractional client secured.',
  'q2-w22-24': 'Gen-AI Leader cert achieved; vendor and safety frameworks drafted; second fractional deal in late-stage discussion.',
  'q2-w25-26': 'Board-Ready AI Strategy deck done; 2+ recruiter conversations completed; fractional revenue trajectory assessed relative to $250K goal.',
  'q3-w27-30': 'NCP-AAI study 50–60% complete; Enterprise AI Strategy Roadmap done; Governance Framework + Agent Workforce Playbook published.',
  'q3-w31-34': 'Multi-agent business workflow built & documented; ROI Dashboard prototype started; NCP-AAI cert obtained; speaking submissions sent.',
  'q3-w35-37': 'AI Transformation Playbook created; board-level AI communication playbook outlined; Rewired read and key ideas integrated.',
  'q3-w38-39': 'Resume/CV updated; narrative doc done; 3–5 repos documented; 5+ exec/mentor conversations completed.',
  'q4-w40-43': 'AWS exam scheduled and main domains studied; AI ROI Dashboard completed; personal site live; capstone article published.',
  'q4-w44-47': 'AWS cert obtained; search firms activated; 5–10 quality applications/week; VC/family office network leveraged; fractional vs full-time decision mapped.',
  'q4-w48-50': 'Interview decks and narratives rehearsed; 2–3 late-stage processes in motion (offers or close to it) OR robust fractional book building.',
  'q4-w51-52': 'Clear decision on primary track; written year-two plan aligned to that track.',
};

function getBlockSummary(block, quarter) {
  const [start, end] = block.week_range || [0, 0];
  const weekLabel = start === end ? `Week ${start}` : `Weeks ${start}–${end}`;

  const studyTasks = block.tasks
    .filter(t => ['credentials', 'strategy', 'technical', 'portfolio', 'leadership'].includes(t.domain))
    .slice(0, 5);
  const whatList = studyTasks.map(t => t.title);
  const what = whatList.length ? whatList.join(' · ') : '—';

  const why = quarter.theme?.slice(0, 220) + (quarter.theme?.length > 220 ? '…' : '') || 'Aligns with quarter goals.';

  return {
    weekLabel,
    weekRange: [start, end],
    blockTitle: block.title,
    what,
    why,
    successMetric: BLOCK_SUCCESS_METRICS[block.id] || 'Key block deliverables completed.',
    quarterName: quarter.name,
    quarterColor: quarter.color || '#64748b',
  };
}

function NarrativeSummary({ goal, version }) {
  return (
    <article className="prose prose-invert max-w-none prose-p:text-text-secondary prose-p:leading-relaxed prose-headings:text-text-primary">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Narrative Summary</h2>
      <p className="text-sm text-text-primary">
        This plan is a single-year bridge from my current role as Head of AI (~$95K) to a $250K+ outcome as either a fractional Chief AI Officer (CAIO) or a full-time CAIO/VP of AI. The path is built on three pillars: <strong className="text-text-primary">governance credentials</strong>, <strong className="text-text-primary">fractional CAIO work</strong>, and <strong className="text-text-primary">multi-agent orchestration</strong> — not traditional ML engineering or cloud certs. The market is shifting. The EU AI Act goes live August 2026. Forrester and IAPP data show governance and “orchestrator who builds” profiles winning; the plan is aligned to that.
      </p>
      <p className="text-sm text-text-primary">
        <strong className="text-text-primary">Months 1–3 (Q1)</strong> establish credibility and positioning. I earn the IAPP AIGP certification and the NVIDIA Agentic AI Professional credential, document every AI project with hard business metrics, and relaunch LinkedIn around governance and orchestration. I apply to executive education (Chicago Booth CAIO Program or Stanford HAI) and draft three fractional CAIO engagement packages — AI Value Rescue, Agent Architecture Sprint, and AI Governance Fast-Track — then begin outreach. By the end of Q1 I have two credentials, a published case study, and at least one serious fractional conversation (letter of intent or verbal). I also start research on Silicon Workforce Management so I can speak to how companies will manage AI agents as a workforce.
      </p>
      <p className="text-sm text-text-primary">
        <strong className="text-text-primary">Months 4–6 (Q2)</strong> convert learning into revenue and artifacts. I attend executive education, build an inference economics financial model and an agent ROI framework (so I can tie AI to P&L in the language CFOs understand), and land my first fractional CAIO client. I build my first multi-agent system using MCP/agentlake thinking and draft the AI Governance Framework and the AI Agent Workforce Management Playbook. A second fractional client and a board-ready AI strategy presentation complete the quarter. Success here means $16K–$20K/month in fractional revenue and a clear portfolio of governance and orchestration deliverables.
      </p>
      <p className="text-sm text-text-primary">
        <strong className="text-text-primary">Months 7–9 (Q3)</strong> are about portfolio and visibility. I publish the Governance Framework and the Agent Workforce Management Playbook as open-source assets, create the Inference Economics Model as a portfolio artifact, and build a multi-agent business workflow with full documentation. I start the AI ROI Measurement Dashboard, publish a substantive thought leadership article, and submit to speak at conferences. I also create the capstone AI Transformation Playbook and sharpen board-level AI communication. By the end of Q3 I have 3+ case studies, 120+ LinkedIn posts, and a clear narrative for recruiters and hiring managers.
      </p>
      <p className="text-sm text-text-primary">
        <strong className="text-text-primary">Months 10–12 (Q4)</strong> are about execution and choice. I complete the ROI Dashboard, refine all portfolio projects, publish a capstone article, and go live with a personal site. I activate search firms, apply to 5–10 roles per week, and leverage my VC/family office network for AI leadership roles. The decision point: if fractional revenue is already at or above $250K annualized, I can be selective about full-time offers; if not, I push for a VP/Director of AI or CAIO role at $250K+ total comp. I close the year with a clear assessment and, if needed, a year-two plan.
      </p>
      <p className="text-sm text-text-primary">
        <strong className="text-text-primary">Target outcome:</strong> $250K+ within 12 months. The fastest path is 2–3 fractional clients at $8K–$10K/month ($192K–$360K annualized). A full-time CAIO role at a meaningful company is often a 2–4 year arc, but the supply–demand imbalance and this credential-and-portfolio mix are meant to compress that. Every week is tied to study (what), rationale (why), and a concrete success metric so progress is measurable.
      </p>
    </article>
  );
}

export default function ExecutiveSummary() {
  const { state } = usePlan();
  const goal = state.meta?.goal || 'From $95K Head of AI to $250K+ CAIO / VP of AI';
  const version = state.meta?.version || '2.1';

  const blocks = state.quarters.flatMap(q =>
    q.blocks.map(b => getBlockSummary(b, q))
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Executive Summary</h1>
        <p className="text-sm text-text-secondary mt-1">
          Narrative overview and week-by-week breakdown
        </p>
        <div className="mt-4 p-4 rounded-lg bg-bg-secondary border border-border">
          <p className="text-sm font-medium text-accent">{goal}</p>
          <p className="text-xs text-text-muted mt-1">
            Plan v{version} — Governance credentials, fractional CAIO, orchestration, and executive positioning.
          </p>
        </div>
      </div>

      <section className="mb-10 p-5 rounded-xl bg-bg-secondary border border-border">
        <NarrativeSummary goal={goal} version={version} />
      </section>

      <h2 className="text-lg font-semibold text-text-primary mb-4">Week-by-week breakdown</h2>
      <div className="space-y-6">
        {blocks.map((row, i) => (
          <section
            key={row.blockTitle + i}
            className="rounded-xl border border-border bg-bg-secondary overflow-hidden"
          >
            <div
              className="px-4 py-2 flex items-center gap-3"
              style={{ borderLeft: `4px solid ${row.quarterColor}` }}
            >
              <span className="text-sm font-bold text-text-primary">{row.weekLabel}</span>
              <span className="text-xs text-text-muted">{row.quarterName}</span>
            </div>
            <div className="px-4 pb-4 pt-1">
              <h2 className="text-base font-semibold text-text-primary mb-3">{row.blockTitle}</h2>
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-0.5">What I’m studying</dt>
                  <dd className="text-text-primary">{row.what}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-0.5">Why</dt>
                  <dd className="text-text-secondary">{row.why}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-0.5">Metric of success</dt>
                  <dd className="text-text-primary font-medium">{row.successMetric}</dd>
                </div>
              </dl>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 p-4 rounded-lg bg-bg-tertiary border border-border text-sm text-text-secondary">
        <p className="font-medium text-text-primary mb-1">Target outcome</p>
        <p>
          $250K+ within 12 months via fractional CAIO (2–3 clients at $8K–$10K/month) or full-time CAIO/VP AI role.
          Full-time at a major company is typically a 2–4 year arc; credentials and demonstrated impact compress the timeline.
        </p>
      </div>
    </div>
  );
}
