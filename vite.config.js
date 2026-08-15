import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { scorePrograms } from './server/aiMatcher.js';

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
            const { situationText, profile, programs } = JSON.parse(body || '{}');
            const results = await scorePrograms({ apiKey: env.ANTHROPIC_API_KEY, situationText, profile, programs });
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), aiMatchApiPlugin(env)],
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
