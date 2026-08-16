// Calls the dev-server /api/extract-program endpoint (see vite.config.js +
// server/aiProgramExtractor.js) to turn a pasted program announcement into
// draft fields for the Programs Registry form. Throws on failure — the
// caller should show the error and let the admin fill the form by hand.
export async function extractProgramListing(rawText) {
  const response = await fetch('/api/extract-program', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText })
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Extraction request failed (${response.status})`);
  }

  const { fields } = await response.json();
  return fields;
}
