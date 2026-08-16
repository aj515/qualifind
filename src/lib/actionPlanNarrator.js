// Calls the dev-server /api/action-plan endpoint (see vite.config.js +
// server/aiActionPlan.js) to get a one-to-two-sentence personalized next-action
// recommendation for a specific program's Action Plan page. Throws on failure —
// callers should fall back to the generic eligibility-based text.
export async function getPersonalizedNextAction({ program, eligibility, documents, steps, completedStepNumbers }) {
  const response = await fetch('/api/action-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ program, eligibility, documents, steps, completedStepNumbers })
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Action plan request failed (${response.status})`);
  }

  const { recommendedAction } = await response.json();
  return recommendedAction;
}
