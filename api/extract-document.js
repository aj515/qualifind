import { extractFromDocument } from '../server/aiDocumentExtractor.js';

// NOTE: Vercel Serverless Functions cap request bodies at 4.5MB regardless of
// this bodyParser setting — that's a platform limit, not configurable here.
// The client's MAX_UPLOAD_BYTES (see vite.config.js / src/lib/matcher.js) is
// currently 10MB of base64, which exceeds that cap. Uploads much bigger than
// a few MB will fail in production even though they work under `vite dev`.
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4.5mb'
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { fileName, mediaType, base64Data, textContent } = req.body || {};
    const result = await extractFromDocument({ apiKey: process.env.ANTHROPIC_API_KEY, fileName, mediaType, base64Data, textContent });
    res.status(200).json(result);
  } catch (err) {
    console.error('[qualifind] /api/extract-document error:', err?.message || err);
    const status = err?.message?.includes('required') || err?.message?.includes('Unsupported') ? 400 : 500;
    res.status(status).json({ error: err?.message || 'Document extraction failed.' });
  }
}
