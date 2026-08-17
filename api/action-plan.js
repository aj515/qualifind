import { narrateActionPlan } from '../server/aiActionPlan.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { program, eligibility, documents, steps, completedStepNumbers } = req.body || {};
    const result = await narrateActionPlan({ apiKey: process.env.ANTHROPIC_API_KEY, program, eligibility, documents, steps, completedStepNumbers });
    res.status(200).json(result);
  } catch (err) {
    console.error('[qualifind] /api/action-plan error:', err?.message || err);
    res.status(err?.message?.includes('required') ? 400 : 500).json({ error: err?.message || 'Action plan narration failed.' });
  }
}
