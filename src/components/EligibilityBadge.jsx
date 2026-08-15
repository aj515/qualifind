import { getEligibilityStyle } from '../lib/eligibility.js';

// `result` is one of 'eligible' | 'potentially_eligible' | 'not_eligible' — pass
// eligibilityByProgramId[program.id]?.result from DataContext, not the program itself
// (eligibility is per-student now, not a static field on the program).
export default function EligibilityBadge({ result }) {
  const style = getEligibilityStyle(result);
  return (
    <span className={`badge-sticker ${style.badgeClass} text-[9px]`}>
      <span className="material-symbols-outlined text-[13px]">{style.icon}</span> {style.label}
    </span>
  );
}
