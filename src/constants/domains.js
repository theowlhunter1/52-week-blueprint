export const DOMAINS = ['build', 'learn', 'credentials', 'income', 'portfolio', 'community'];

export const DOMAIN_CONFIG = {
  build:       { label: 'Build',       color: 'bg-domain-build',       cssVar: 'var(--color-domain-build)' },
  learn:       { label: 'Learn',       color: 'bg-domain-learn',       cssVar: 'var(--color-domain-learn)' },
  credentials: { label: 'Credentials', color: 'bg-domain-credentials', cssVar: 'var(--color-domain-credentials)' },
  income:      { label: 'Income',      color: 'bg-domain-income',      cssVar: 'var(--color-domain-income)' },
  portfolio:   { label: 'Portfolio',   color: 'bg-domain-portfolio',   cssVar: 'var(--color-domain-portfolio)' },
  community:   { label: 'Community',   color: 'bg-domain-community',   cssVar: 'var(--color-domain-community)' },
};

export const DEFAULT_DOMAIN = 'build';

export const PILLAR_LABELS = {
  'agent-engineering': 'Agent Engineering & Infrastructure',
  'ai-reliability': 'AI Reliability & Security',
  'product-delivery': 'Product Delivery & Portfolio',
  'income-positioning': 'Income & Market Positioning',
};

export const PILLAR_OPTIONS = Object.entries(PILLAR_LABELS).map(([value, label]) => ({ value, label }));

export const DEFAULT_PILLAR = 'agent-engineering';

export const MAX_WEEK = 24;
