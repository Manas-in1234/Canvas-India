import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import os from 'os';

function uploadSessionPlugin(): Plugin {
  // In-memory store: sessionId -> { images: string[]; updatedAt: number }
  const sessions = new Map<string, { images: string[]; updatedAt: number }>();

  // Cleanup sessions older than 1 hour every 10 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [id, sess] of sessions.entries()) {
      if (now - sess.updatedAt > 60 * 60 * 1000) {
        sessions.delete(id);
      }
    }
  }, 10 * 60 * 1000);

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), uploadSessionPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  }
});
