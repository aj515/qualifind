import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { scorePrograms } from './server/aiMatcher.js';
import { extractFromDocument } from './server/aiDocumentExtractor.js';

// Dev-only /api/match endpoint, served from inside the Vite dev server process
// (no separate backend to run) — forwards free-text matcher requests to Claude.
// NOTE: this middleware only runs under `vite dev`; it is not part of `vite build`
// output. For a production deploy, port server/aiMatcher.js into a Supabase Edge
// Function and call that from src/lib/matcher.js instead.
function aiMatchApiPlugin(env) {
  return {
    name: 'qualifind-ai-match-api',
    configureServer(server) {
      server.middlewares.use('/api/match', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const { situationText, profile, programs, eligibilityByProgramId } = JSON.parse(body || '{}');
            const results = await scorePrograms({ apiKey: env.ANTHROPIC_API_KEY, situationText, profile, programs, eligibilityByProgramId });
            res.end(JSON.stringify({ results }));
          } catch (err) {
            console.error('[qualifind] /api/match error:', err?.message || err);
            res.statusCode = err?.message?.includes('required') ? 400 : 500;
            res.end(JSON.stringify({ error: err?.message || 'AI matching failed.' }));
          }
        });
      });
    }
  };
}

// Dev-only /api/extract-document endpoint — reads an uploaded document (PDF,
// image, or .txt) and asks Claude to pull out scholarship-relevant fields plus
// a ready-to-paste prompt summary. Same "port to a Supabase Edge Function for
// production" caveat as the matcher endpoint above.
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB, base64-encoded size

function aiExtractApiPlugin(env) {
  return {
    name: 'qualifind-ai-extract-api',
    configureServer(server) {
      server.middlewares.use('/api/extract-document', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }

        let body = '';
        let tooLarge = false;
        req.on('data', (chunk) => {
          body += chunk;
          if (body.length > MAX_UPLOAD_BYTES) {
            tooLarge = true;
            req.destroy();
          }
        });
        req.on('end', async () => {
          if (tooLarge) return;
          res.setHeader('Content-Type', 'application/json');
          try {
            const { fileName, mediaType, base64Data, textContent } = JSON.parse(body || '{}');
            const result = await extractFromDocument({ apiKey: env.ANTHROPIC_API_KEY, fileName, mediaType, base64Data, textContent });
            res.end(JSON.stringify(result));
          } catch (err) {
            console.error('[qualifind] /api/extract-document error:', err?.message || err);
            res.statusCode = err?.message?.includes('required') || err?.message?.includes('Unsupported') ? 400 : 500;
            res.end(JSON.stringify({ error: err?.message || 'Document extraction failed.' }));
          }
        });
        req.on('error', () => {});
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), aiMatchApiPlugin(env), aiExtractApiPlugin(env)],
    server: {
      port: 8080,
      strictPort: true,
      open: false
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
});
