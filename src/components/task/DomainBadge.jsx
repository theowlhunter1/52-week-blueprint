import { DOMAIN_CONFIG } from '../../constants/domains';

export default function DomainBadge({ domain, size = 'sm' }) {
  const config = DOMAIN_CONFIG[domain] || { label: domain, color: 'bg-gray-500' };
  const sizeClass = size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span className={`${config.color} text-white rounded font-medium ${sizeClass} inline-block`}>
      {config.label}
    </span>
  );
}
