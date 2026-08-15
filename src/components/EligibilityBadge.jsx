import { getEligibilityStyle } from '../lib/eligibility.js';

export default function EligibilityBadge({ program }) {
  const style = getEligibilityStyle(program);
  return (
    <span className={`badge-sticker ${style.badgeClass} text-[9px]`}>
      <span className="material-symbols-outlined text-[13px]">{style.icon}</span> {style.label}
    </span>
  );
}
