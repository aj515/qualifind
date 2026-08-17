import { scorePrograms } from '../server/aiMatcher.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { situationText, profile, programs, eligibilityByProgramId } = req.body || {};
    const result = await scorePrograms({ apiKey: process.env.ANTHROPIC_API_KEY, situationText, profile, programs, eligibilityByProgramId });
    res.status(200).json(result);
  } catch (err) {
    console.error('[qualifind] /api/match error:', err?.message || err);
    res.status(err?.message?.includes('required') ? 400 : 500).json({ error: err?.message || 'AI matching failed.' });
  }
}
