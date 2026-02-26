export const PILLAR_LABELS = {
  'governance-risk': 'Governance & Risk',
  'strategy-transformation': 'Strategy & Transformation',
  'systems-platforms': 'Systems & Platforms',
  'fractional-exec': 'Fractional CAIO & Executive Positioning',
};

export const TEMPLATES = {
  'governance-risk_technical':
    'This work directly strengthens your Governance & Risk pillar. Present to leadership as: hands-on AI governance and risk management implementation, demonstrating the technical controls and safety protocols that AIGP-certified leaders deliver. Portfolio angle: reference in your AI Governance Framework as a real-world case study of applied risk controls.',

  'governance-risk_strategy':
    'This work directly strengthens your Governance & Risk pillar. Present to leadership as: strategic AI risk assessment and policy development, demonstrating the governance thinking that boards and regulators expect from AI leaders. Portfolio angle: incorporate into your AI Governance Charter and Risk Register as evidence of strategic risk governance.',

  'governance-risk_leadership':
    'This work directly strengthens your Governance & Risk pillar. Present to leadership as: cross-functional AI governance leadership, demonstrating ability to drive organizational compliance and accountability. Portfolio angle: add to your fractional CAIO engagement narrative as evidence of governance leadership in practice.',

  'governance-risk_credentials':
    'This work directly strengthens your Governance & Risk pillar. Present to leadership as: applied governance expertise that validates your AIGP certification, demonstrating real-world mastery beyond the exam. Portfolio angle: cite as practical evidence alongside your AIGP credential.',

  'governance-risk_networking':
    'This work directly strengthens your Governance & Risk pillar. Present to leadership as: AI governance community engagement and stakeholder management, building the cross-functional relationships that effective governance requires. Portfolio angle: reference in conversations with search firms as evidence of governance-in-practice.',

  'governance-risk_portfolio':
    'This work directly strengthens your Governance & Risk pillar. Present to leadership as: documented governance artifacts with measurable compliance outcomes. Portfolio angle: publish (scrubbed) as an open-source template or case study demonstrating governance maturity.',

  'strategy-transformation_technical':
    'This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: technical execution that directly supports AI transformation objectives, demonstrating ability to bridge strategy and implementation. Portfolio angle: document architecture decisions and business impact for your AI Transformation Playbook.',

  'strategy-transformation_strategy':
    'This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: strategic AI initiative design that drives measurable business outcomes, demonstrating the ROI-focused thinking that CAIO roles demand. Portfolio angle: incorporate into your Board-Ready AI Strategy deck as a proven initiative.',

  'strategy-transformation_leadership':
    'This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: change management and organizational alignment for AI adoption, demonstrating the transformation leadership that differentiates senior AI executives. Portfolio angle: add to your AI Transformation Playbook as a change management case study.',

  'strategy-transformation_credentials':
    'This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: applied strategic expertise that validates your certifications with demonstrated impact. Portfolio angle: cite as evidence that credentials translate to business outcomes.',

  'strategy-transformation_networking':
    'This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: stakeholder engagement and executive communication around AI transformation, building the internal champions that successful AI programs require. Portfolio angle: reference in exec-ed conversations and LinkedIn posts about transformation lessons learned.',

  'strategy-transformation_portfolio':
    'This work directly strengthens your Strategy & Transformation pillar. Present to leadership as: documented transformation artifacts with measurable outcomes. Portfolio angle: add as a case study in your Enterprise AI Strategy Roadmap template.',

  'systems-platforms_technical':
    'This work directly strengthens your Systems & Platforms pillar. Present to leadership as: hands-on AI systems architecture and platform engineering, demonstrating the builder credibility that complements your governance and strategy credentials. Portfolio angle: document as a technical case study for your GitHub portfolio and NCP-AAI credential evidence.',

  'systems-platforms_strategy':
    'This work directly strengthens your Systems & Platforms pillar. Present to leadership as: platform strategy and build-vs-buy decision-making that optimizes AI infrastructure spend. Portfolio angle: incorporate into your Inference Economics Model as a real-world cost and architecture analysis.',

  'systems-platforms_leadership':
    'This work directly strengthens your Systems & Platforms pillar. Present to leadership as: technical team leadership and platform governance, demonstrating ability to lead engineering teams on AI infrastructure decisions. Portfolio angle: add to your career narrative as evidence of hands-on technical leadership.',

  'systems-platforms_credentials':
    'This work directly strengthens your Systems & Platforms pillar. Present to leadership as: applied platform expertise validating your cloud and architecture certifications (Gen-AI Leader, NCP-AAI, AWS). Portfolio angle: cite as practical evidence alongside your credential spine.',

  'systems-platforms_networking':
    'This work directly strengthens your Systems & Platforms pillar. Present to leadership as: vendor and partner relationship management for AI platform decisions. Portfolio angle: reference in your enterprise AI vendor evaluation framework.',

  'systems-platforms_portfolio':
    'This work directly strengthens your Systems & Platforms pillar. Present to leadership as: documented system architecture with performance metrics and business impact. Portfolio angle: publish architecture diagrams and outcomes in your GitHub portfolio.',

  'fractional-exec_technical':
    "This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: hands-on technical execution that demonstrates you're a builder-leader, not just a strategist \u2014 the profile that hiring committees and fractional clients value most. Portfolio angle: use as client-facing case study in your engagement packages.",

  'fractional-exec_strategy':
    'This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: strategic AI advisory work with measurable business impact, directly demonstrating the value proposition of your fractional CAIO engagement packages. Portfolio angle: add to your AI Value Rescue or AI Strategy Fast-Track engagement evidence.',

  'fractional-exec_leadership':
    'This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: executive-level AI leadership demonstrating board-ready communication, team building, and organizational transformation. Portfolio angle: reference in search firm conversations and your career narrative document.',

  'fractional-exec_credentials':
    'This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: practical application of your credential stack (AIGP + Gen-AI Leader + NCP-AAI + AWS), proving that certifications translate to real organizational impact. Portfolio angle: cite in LinkedIn posts connecting credentials to outcomes.',

  'fractional-exec_networking':
    'This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: relationship building and executive network expansion that directly supports your CAIO trajectory. Portfolio angle: leverage these connections for warm introductions to fractional CAIO prospects and full-time opportunities.',

  'fractional-exec_portfolio':
    'This work directly strengthens your Fractional CAIO & Executive Positioning pillar. Present to leadership as: documented executive deliverables demonstrating CAIO-caliber output. Portfolio angle: add as a capstone artifact to your personal site and use in interview prep narratives.',
};

export function generateExecFraming(pillar, domain) {
  const key = `${pillar}_${domain}`;
  if (TEMPLATES[key]) {
    return TEMPLATES[key];
  }
  // Fallback: generic framing using pillar label
  const pillarLabel = PILLAR_LABELS[pillar] || pillar;
  return `This work directly strengthens your ${pillarLabel} pillar. Present to leadership as: applied ${domain} work that advances your CAIO trajectory. Portfolio angle: document outcomes and reference in your career narrative.`;
}
