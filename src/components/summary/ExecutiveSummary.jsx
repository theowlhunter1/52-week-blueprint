import { usePlan } from '../../context/PlanContext';

/**
 * Success metrics per block id — executive-summary style deliverables.
 * Kept in sync with plan; update when blocks change.
 */
const BLOCK_SUCCESS_METRICS = {
  'q1-w1-2': 'LinkedIn relaunched; AIGP prep started; first post live; 10 AI leaders connected.',
  'q1-w3-4': '3–5 case studies drafted; applied to Booth/Stanford HAI; 2–3 posts/week cadence locked.',
  'q1-w5-8': 'AIGP 60–75% complete; NIST/EU AI Act/ISO studied; 3 engagement packages drafted; 1 case study published.',
  'q1-w9-10': 'AIGP exam passed; NCP-AAI exam passed; multi-agent orchestration learning started.',
  'q1-w11-13': 'First AI Strategy Brief done; IAPP + 2 communities joined; 3 search firms contacted; 1 fractional LOI or verbal.',
  'q2-w14-17': 'Exec ed started or attended; inference economics model built; agent ROI framework created; first fractional client secured.',
  'q2-w18-21': 'First multi-agent system built (MCP/agentlake); AI Governance Framework drafted; Agent Workforce Playbook started; 2nd case study published.',
  'q2-w22-24': '2nd fractional client secured ($16K–$20K/month total); AI safety/vendor evaluation frameworks done; first podcast pitch sent.',
  'q2-w25-26': 'Board-Ready AI Strategy deck done; multi-agent blog post published; 2+ recruiter conversations; revenue trajectory assessed.',
  'q3-w27-30': 'Enterprise AI Strategy Roadmap done; Governance Framework + Agent Workforce Playbook published; Inference Economics Model artifact; Ai4 attended.',
  'q3-w31-34': 'Multi-agent business workflow built & documented; ROI Dashboard started; thought leadership article published; speaking submissions sent.',
  'q3-w35-37': 'AI Transformation Playbook created; board-level AI communication studied; Rewired read.',
  'q3-w38-39': 'Resume/CV updated; career narrative doc done; 5+ exec ed conversations; 3–5 GitHub repos documented.',
  'q4-w40-43': 'AI ROI Dashboard completed; all portfolio projects refined; personal site live; capstone article published.',
  'q4-w44-47': 'Search firms activated; 5–10 applications/week; VC network leveraged; fractional vs full-time decision made.',
  'q4-w48-50': 'Interview prep done; 2–3 posts/week maintained; positioning (fractional vs full-time) evaluated.',
  'q4-w51-52': 'Year-end assessment completed; year-two plan created if needed.',
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
          52-week plan: what you’re studying, why, and how success is measured
        </p>
        <div className="mt-4 p-4 rounded-lg bg-bg-secondary border border-border">
          <p className="text-sm font-medium text-accent">{goal}</p>
          <p className="text-xs text-text-muted mt-1">
            Plan v{version} — Governance credentials, fractional CAIO, orchestration, and executive positioning.
          </p>
        </div>
      </div>

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
