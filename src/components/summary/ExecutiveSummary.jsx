import { usePlan } from '../../context/PlanContext';
import { DOMAINS } from '../../constants/domains';

/**
 * Success metrics per block id — executive-summary style deliverables.
 * Kept in sync with plan; update when blocks change.
 */
const BLOCK_SUCCESS_METRICS = {
  'q1-w1-2': 'Document ingestion pipeline shipping: text extraction from VDR docs, pgvector embeddings stored, chunking strategy tested. RAG reference content watched.',
  'q1-w3-4': 'AI analysis uses real document content via semantic search. Natural language VDR querying working. Chunk size experiment documented with real numbers. AIGP study started.',
  'q1-w5-6': 'MCP server or tool calling implemented in DroplightOS. Multi-tool deal analysis agent built with system diagram. Tool schema experiment (vague vs strict) documented.',
  'q1-w7-8': 'Retry/fallback/timeout wired on AI calls with measured before/after success rates. Sentry + observability live. Prompt injection red-team completed. Security PRs merged.',
  'q1-w9-10': 'Eval pipeline with 15-20 test cases and measured baseline. Confidence thresholds and escalation paths added. Error boundaries across all routes. DroplightOS packaged as demo. Service offering defined.',
  'q1-w11-12': 'AIGP exam taken (or booked with 70%+ mastery). AI services pitched to 3-5 prospects. $200K+ role landscape researched. GitHub and LinkedIn updated.',
  'q2-w13-16': 'Multi-agent workflow built for complex deal analysis. Advanced RAG features (re-ranking, hybrid search) measured against Q1 baseline.',
  'q2-w17-20': 'First paid AI implementation engagement landed. AIGP certified (or next cert started). Active in job market if pursuing employment path.',
  'q2-w21-24': 'Clear decision: employment vs services. Agent Engineering Review written. Q3 direction set based on real data.',
};

function getBlockSummary(block, quarter) {
  const [start, end] = block.week_range || [0, 0];
  const weekLabel = start === end ? `Week ${start}` : `Weeks ${start}–${end}`;

  const keyTasks = block.tasks
    .filter(t => DOMAINS.includes(t.domain))
    .slice(0, 5);
  const whatList = keyTasks.map(t => t.title);
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

function NarrativeSummary() {
  return (
    <article className="prose prose-invert max-w-none prose-p:text-text-secondary prose-p:leading-relaxed prose-headings:text-text-primary">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Narrative Summary</h2>
      <p className="text-sm text-text-primary">
        This plan is a quarterly sprint from $110K Head of AI to $200K+ — either through AI implementation services or a full-time AI engineering role. It is organized around four pillars: <strong className="text-text-primary">agent engineering &amp; infrastructure</strong>, <strong className="text-text-primary">AI reliability &amp; security</strong>, <strong className="text-text-primary">product delivery &amp; portfolio</strong>, and <strong className="text-text-primary">income &amp; market positioning</strong>. The approach is build-first: every skill gap gets filled by building it into DroplightOS, a production M&A platform with 47 database models, real auth, real AI analysis, and 152 merged PRs. Learning happens through doing, not studying.
      </p>
      <p className="text-sm text-text-primary">
        <strong className="text-text-primary">Q1 (Weeks 1–12): Wire the Pipeline, Ship the Agent.</strong> The first quarter fills the two biggest skill gaps — RAG and observability — by building them into DroplightOS. Weeks 1–4 add a document ingestion pipeline (text extraction, embeddings, chunking) and wire semantic search into the AI analysis suite so it analyzes real document content instead of metadata. Weeks 5–6 add MCP/tool calling and build a multi-tool deal analysis agent. Weeks 7–8 harden reliability (retry, fallback, circuit breaker) and security (Sentry, prompt injection testing). Weeks 9–10 build an eval pipeline and add product polish (confidence thresholds, error boundaries). Weeks 11–12 convert skills to income: take the AIGP exam, pitch AI services, research $200K+ roles, and update GitHub/LinkedIn.
      </p>
      <p className="text-sm text-text-primary">
        <strong className="text-text-primary">Q2 (Weeks 13–24): Deepen, Deliver, Decide.</strong> The second quarter is intentionally loose — the AI landscape shifts too fast for detailed long-range plans. The direction: build complex multi-agent workflows, land the first paid AI implementation client, complete AIGP if not done, and make a deliberate decision about whether to pursue employment or services. Re-evaluate at the end of Q2 and plan Q3 based on what's actually happened, not assumptions.
      </p>
      <p className="text-sm text-text-primary">
        <strong className="text-text-primary">Target outcome:</strong> $200K+ as quickly as possible. The fastest path is AI implementation services (2–3 clients at $8K–$10K/month). A full-time AI Engineer or Solutions Architect role at a company building agent infrastructure pays $180K–$250K+. Both paths benefit from the same proof: a production platform with real RAG, real agents, real reliability engineering, and measured eval results. AIGP adds governance credibility on top of engineering capability — a rare combination.
      </p>
    </article>
  );
}

export default function ExecutiveSummary() {
  const { state } = usePlan();
  const goal = state.meta?.goal || 'Agent Engineer to $200K+';
  const version = state.meta?.version || '4.0';

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
            Plan v{version} — Agent engineering &amp; infrastructure, AI reliability &amp; security, product delivery &amp; portfolio, income &amp; market positioning.
          </p>
        </div>
      </div>

      <section className="mb-10 p-5 rounded-xl bg-bg-secondary border border-border">
        <NarrativeSummary />
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
                  <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-0.5">Key activities</dt>
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
          $200K+ via AI implementation services (2–3 clients at $8K–$10K/month) or full-time AI Engineer / Solutions Architect role ($180K–$250K+).
          Both paths benefit from the same proof: production agent infrastructure with real RAG, real reliability, and measured results.
        </p>
      </div>
    </div>
  );
}
