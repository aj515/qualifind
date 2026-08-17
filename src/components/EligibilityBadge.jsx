import { getEligibilityStyle } from '../lib/eligibility.js';
import Tooltip from './Tooltip.jsx';

const TIER_EXPLANATIONS = {
  eligible: 'You meet all of this program\'s stated requirements based on your current profile.',
  potentially_eligible: 'You meet most requirements, but a few can\'t be confirmed yet — usually a missing profile field or a step only the provider can verify.',
  not_eligible: 'Your profile currently falls short of one or more required criteria for this program.'
};

// `result` is one of 'eligible' | 'potentially_eligible' | 'not_eligible' — pass
// eligibilityByProgramId[program.id]?.result from DataContext, not the program itself
// (eligibility is per-student now, not a static field on the program).
export default function EligibilityBadge({ result }) {
  const style = getEligibilityStyle(result);
  return (
    <Tooltip text={TIER_EXPLANATIONS[result] || TIER_EXPLANATIONS.not_eligible}>
      <span className={`badge-sticker ${style.badgeClass} text-[9px]`}>
        <span className="material-symbols-outlined text-[13px]">{style.icon}</span> {style.label}
      </span>
    </Tooltip>
  );
}
