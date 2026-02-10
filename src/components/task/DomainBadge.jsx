const domainConfig = {
  technical: { label: 'Technical', color: 'bg-domain-technical' },
  strategy: { label: 'Strategy', color: 'bg-domain-strategy' },
  leadership: { label: 'Leadership', color: 'bg-domain-leadership' },
  credentials: { label: 'Credentials', color: 'bg-domain-credentials' },
  networking: { label: 'Networking', color: 'bg-domain-networking' },
  portfolio: { label: 'Portfolio', color: 'bg-domain-portfolio' },
};

export default function DomainBadge({ domain, size = 'sm' }) {
  const config = domainConfig[domain] || { label: domain, color: 'bg-gray-500' };
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span className={`${config.color} text-white rounded font-medium ${sizeClass} inline-block`}>
      {config.label}
    </span>
  );
}
