import { extractProgramFromText } from '../server/aiProgramExtractor.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { rawText } = req.body || {};
    const fields = await extractProgramFromText({ apiKey: process.env.ANTHROPIC_API_KEY, rawText });
    res.status(200).json({ fields });
  } catch (err) {
    console.error('[qualifind] /api/extract-program error:', err?.message || err);
    res.status(err?.message?.includes('required') ? 400 : 500).json({ error: err?.message || 'Program extraction failed.' });
  }
}
