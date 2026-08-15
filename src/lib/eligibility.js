// Ported from the old app.js's getGapAnalysis/getEligibilityBadgeHtml, adapted to the
// Supabase `programs` row shape (snake_case columns, requirements/gap_analysis as JSONB).

export function formatDeadline(deadline) {
  if (!deadline) return { formatted: '—', daysLeft: null };
  const target = new Date(`${deadline}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((target - today) / 86400000);
  const formatted = target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return { formatted, daysLeft };
}

export function getGapAnalysis(program) {
  if (program.gap_analysis) return program.gap_analysis;

  const reqs = program.requirements || [];
  const metCount = reqs.filter((r) => r.status === 'satisfied').length;
  const totalCount = reqs.length;
  if (totalCount === 0) return null;

  const blocking = reqs.find((r) => r.status === 'unmet');
  if (blocking) {
    const lowerDesc = blocking.desc.charAt(0).toLowerCase() + blocking.desc.slice(1);
    const currentStanding = blocking.note.replace(/^(Unmet|Not Met):\s*/i, '');
    return {
      type: 'blocked',
      metCount,
      totalCount,
      gapSummary: `You meet ${metCount} of ${totalCount} requirements. The program requires ${lowerDesc}, while your current standing is: ${currentStanding}.`,
      missingRequirement: blocking.title
    };
  }

  const needsVerification = reqs.filter((r) => r.status === 'action' || r.status === 'pending');
  if (needsVerification.length > 0) {
    return {
      type: 'verification',
      metCount,
      totalCount,
      gapSummary: `You meet ${metCount} of ${totalCount} requirements. The remaining ${needsVerification.length} need${
        needsVerification.length === 1 ? '' : 's'
      } verification: ${needsVerification.map((r) => r.title).join(', ')}.`,
      missingRequirement: needsVerification.map((r) => r.title).join(', ')
    };
  }

  return null;
}

const ELIGIBILITY_STYLES = {
  Eligible: { badgeClass: 'badge-mint', icon: 'check_circle', label: 'Eligible' },
  'Potentially Eligible': { badgeClass: 'badge-amber', icon: 'pending', label: 'Potentially Eligible' },
  'Not Eligible': { badgeClass: 'badge-pink', icon: 'cancel', label: 'Not Eligible' }
};

export function getEligibilityStyle(program) {
  return ELIGIBILITY_STYLES[program.eligibility_status] || ELIGIBILITY_STYLES['Not Eligible'];
}

const REQUIREMENT_STYLES = {
  satisfied: { iconColor: 'bg-accent-mint text-ink', icon: 'check', badgeClass: 'badge-mint' },
  action: { iconColor: 'bg-accent-amber text-ink', icon: 'priority_high', badgeClass: 'badge-amber' },
  pending: { iconColor: 'bg-paper text-ink-muted', icon: 'schedule', badgeClass: 'badge-violet' },
  unmet: { iconColor: 'bg-accent-pink text-white', icon: 'close', badgeClass: 'badge-pink' }
};

export function getRequirementStyle(status) {
  return REQUIREMENT_STYLES[status] || REQUIREMENT_STYLES.satisfied;
}

export const ELIGIBILITY_RANK = { Eligible: 0, 'Potentially Eligible': 1, 'Not Eligible': 2 };
