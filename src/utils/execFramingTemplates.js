import { PILLAR_LABELS } from '../constants/domains';

export { PILLAR_LABELS };

export const TEMPLATES = {
  'agent-engineering_build':
    'This work strengthens your Agent Engineering pillar through DroplightOS. Present as: production agent infrastructure with real data, real users, real decisions — not a tutorial project. Portfolio angle: reference architecture decisions, tool calling patterns, and reliability metrics in interviews and client pitches.',

  'agent-engineering_learn':
    'This learning directly supports your Agent Engineering pillar. Apply concepts to DroplightOS immediately — the value is in building, not in completing a course. Document one concrete thing you changed in your system based on what you learned.',

  'agent-engineering_credentials':
    'This credential work complements your Agent Engineering pillar. Frame as: governance-aware agent engineer who understands both the technical and compliance dimensions. AIGP + hands-on agent engineering is a rare and valuable combination.',

  'agent-engineering_income':
    'This income-generating work leverages your Agent Engineering pillar. Lead with what you\'ve built (DroplightOS, RAG pipelines, agent orchestration) as proof of capability. Clients and employers buy demonstrated results, not credentials alone.',

  'agent-engineering_portfolio':
    'This portfolio work showcases your Agent Engineering pillar. Document architecture decisions, not just features. Show the system diagram, tool schemas, reliability checklist, and eval results. Technical evaluators want to see how you think, not just what you shipped.',

  'agent-engineering_community':
    'This community engagement amplifies your Agent Engineering pillar. Share real builds with real numbers — architecture decisions, failure modes, performance metrics. Real builds in AI implementation groups > thought leadership posts on LinkedIn.',

  'ai-reliability_build':
    'This work strengthens your AI Reliability pillar. Present as: production-grade AI infrastructure with retry logic, fallback chains, circuit breakers, and observability. This is what separates hobby projects from systems that run in production.',

  'ai-reliability_learn':
    'This learning supports your AI Reliability pillar. Focus on patterns (exponential backoff, circuit breaker, timeout) and how they apply specifically to LLM/agent systems. Apply to DroplightOS\'s AI provider chain immediately.',

  'ai-reliability_credentials':
    'This credential work intersects with your AI Reliability pillar. Governance frameworks (NIST AI RMF, EU AI Act) require ongoing monitoring and risk management — directly tied to the observability and safety systems you\'re building.',

  'ai-reliability_income':
    'This income work leverages your AI Reliability pillar. Companies struggling with AI in production need exactly this: someone who can make their AI systems reliable, observable, and safe. Lead with your reliability checklist and security audit experience.',

  'ai-reliability_portfolio':
    'This portfolio work documents your AI Reliability pillar. Show the before/after: success rates with and without retry logic, the threat model from your red-team exercise, the observability dashboard. Quantified reliability improvements are compelling evidence.',

  'ai-reliability_community':
    'This community engagement showcases your AI Reliability pillar. Share your reliability checklist, red-team results, or observability setup. Most agent engineers skip this — demonstrating production reliability thinking sets you apart.',

  'product-delivery_build':
    'This work strengthens your Product Delivery pillar. DroplightOS is your proof that you ship production software — 47 DB models, real auth, real AI, 152 PRs. Every feature shipped adds to the evidence that you deliver, not just prototype.',

  'product-delivery_learn':
    'This learning supports your Product Delivery pillar. Focus on product thinking: when should the agent signal uncertainty? When should it escalate to a human? How do you measure whether the AI is actually helping users?',

  'product-delivery_credentials':
    'This credential work supports your Product Delivery pillar. Certifications validate knowledge, but shipped products validate capability. Frame credentials alongside the products you\'ve delivered.',

  'product-delivery_income':
    'This income work leverages your Product Delivery pillar. Lead with what you\'ve shipped: a production M&A platform, a deal analysis agent, a document ingestion pipeline. Delivery track record is the strongest sales tool.',

  'product-delivery_portfolio':
    'This portfolio work showcases your Product Delivery pillar. Ensure every project has: business context, architecture decisions, measurable outcomes, and a clear narrative. Evaluators want to see end-to-end delivery, not isolated features.',

  'product-delivery_community':
    'This community engagement demonstrates your Product Delivery pillar. Share case studies of what you shipped, including the hard parts — architecture pivots, failure modes, trade-offs. Honest delivery stories build more credibility than success theater.',

  'income-positioning_build':
    'This build work directly supports your Income & Positioning pillar. Everything you build in DroplightOS is evidence for clients and employers. Keep the demo-able state clean — you should be able to show this in any conversation.',

  'income-positioning_learn':
    'This learning supports your Income & Positioning pillar. Focus on understanding the market: what roles pay $200K+? What skills do they require? What are AI implementation clients actually buying? Learn what the market values, then build that.',

  'income-positioning_credentials':
    'This credential work directly supports your Income & Positioning pillar. AIGP + production agent engineering is a differentiated combination. Frame certifications as validation of what you already do, not as prerequisites for doing it.',

  'income-positioning_income':
    'This is direct income-generating work. Focus on conversion: proposals, pitches, applications, interviews. Use your DroplightOS portfolio and agent engineering skills as the proof points. The goal is $200K+ — either through services or employment.',

  'income-positioning_portfolio':
    'This portfolio work supports your Income & Positioning pillar. Your portfolio IS your sales tool — for both job interviews and client pitches. Keep it sharp, current, and demo-ready.',

  'income-positioning_community':
    'This community engagement supports your Income & Positioning pillar. Your AI implementation groups are your pipeline. Build relationships, share value, and let opportunities emerge from demonstrated capability.',
};

export function generateExecFraming(pillar, domain) {
  const key = `${pillar}_${domain}`;
  return TEMPLATES[key] || `This work contributes to your ${PILLAR_LABELS[pillar] || pillar} pillar in the ${domain} domain.`;
}
