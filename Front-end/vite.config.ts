import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import os from 'os';

function uploadSessionPlugin(): Plugin {
  // In-memory store: sessionId -> { images: string[]; updatedAt: number }
  const sessions = new Map<string, { images: string[]; updatedAt: number }>();

  // Cleanup sessions older than 1 hour every 10 minutes
  // unref() so this timer never keeps `vite build` (e.g. on Vercel) alive after it finishes
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [id, sess] of sessions.entries()) {
      if (now - sess.updatedAt > 60 * 60 * 1000) {
        sessions.delete(id);
      }
    }
  }, 10 * 60 * 1000);
  cleanupTimer.unref();

  const getLocalIp = (): string | null => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    return null;
  };

  const handler = (req: any, res: any, next: any) => {
    const host = req.headers.host || 'localhost:3000';
    const parsedUrl = new URL(req.url || '', `http://${host}`);

    // Set CORS headers for network testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    // Endpoint to report server LAN IP
    if (parsedUrl.pathname === '/api/server-info' && req.method === 'GET') {
      const localIp = getLocalIp();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ localIp, port: 3000 }));
      return;
    }

    // Endpoint for mobile upload sessions
    if (parsedUrl.pathname.startsWith('/api/upload-session/')) {
      const sessionId = parsedUrl.pathname.replace('/api/upload-session/', '').trim();
      if (!sessionId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session ID is required' }));
        return;
      }

      if (req.method === 'GET') {
        const session = sessions.get(sessionId);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          sessionId,
          images: session ? session.images : [] 
        }));
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (!data.image) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Image data is required' }));
              return;
            }
            const existing = sessions.get(sessionId) || { images: [], updatedAt: Date.now() };
            existing.images.push(data.image);
            existing.updatedAt = Date.now();
            sessions.set(sessionId, existing);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: true, 
              count: existing.images.length,
              sessionId 
            }));
          } catch (err: any) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
        });
        return;
      }

      if (req.method === 'DELETE') {
        sessions.delete(sessionId);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
        return;
      }
    }

    next();
  };

  return {
    name: 'upload-session-api',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

function validateEnvironmentPlugin(mode: string, command: string): Plugin {
  return {
    name: 'validate-environment-plugin',
    configResolved(config) {
      if (mode === 'production' || command === 'build') {
        // General required variables — must be non-empty, non-placeholder
        const requiredVars = [
          'VITE_SUPABASE_URL',
          'VITE_SUPABASE_ANON_KEY',
          'VITE_API_BASE_URL',
        ];

        const missingVars = requiredVars.filter(key => {
          const val = config.env[key] || process.env[key];
          return !val || typeof val !== 'string' || val.trim() === '' || val.includes('placeholder') || val.includes('your-');
        });

        // Razorpay Key ID — must be present and start with rzp_live_ or rzp_test_
        const razorpayKey = (config.env['VITE_RAZORPAY_KEY_ID'] || process.env['VITE_RAZORPAY_KEY_ID'] || '').trim();
        const razorpayValid =
          razorpayKey.length > 0 &&
          (razorpayKey.startsWith('rzp_live_') || razorpayKey.startsWith('rzp_test_')) &&
          !razorpayKey.includes('placeholder');
        if (!razorpayValid) {
          missingVars.push(
            'VITE_RAZORPAY_KEY_ID (must be present and start with rzp_live_ or rzp_test_)'
          );
        }

        if (missingVars.length > 0) {
          throw new Error(
            `\n==============================================================\n` +
            `[FATAL BUILD ERROR] Missing Required Production Environment Variable(s):\n` +
            missingVars.map(v => `  - ${v}`).join('\n') +
            `\n\nVite production builds REQUIRE these variables to be configured.` +
            `\nEnsure they are present in .env.local, .env.production, or build environment variables.` +
            `\nDeployment aborted to prevent generating a non-functional storefront bundle.` +
            `\n==============================================================\n`
          );
        }
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  plugins: [react(), tailwindcss(), uploadSessionPlugin(), validateEnvironmentPlugin(mode, command)],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
}));
