/**
 * @file Production HTTP Server for Render & Cloud Deployment
 * Serves the compiled Vite production bundle (dist/) and handles all backend API routes:
 * - GET  /api/status
 * - POST /api/cache/clear
 * - GET  /api/flights/search
 * - POST /api/notifications/email
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchFlightsService, getApiStatus, clearServerCache } from './server/flightService.js';
import { sendFlightAlertEmail } from './server/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. Backend API Routes
  if (pathname.startsWith('/api/')) {
    // Route: GET /api/status
    if (pathname === '/api/status' && req.method === 'GET') {
      try {
        const status = getApiStatus(process.env);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', ...status }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // Route: POST /api/cache/clear
    if (pathname === '/api/cache/clear' && req.method === 'POST') {
      try {
        const result = clearServerCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // Route: GET /api/flights/search
    if (pathname === '/api/flights/search' && req.method === 'GET') {
      const origin = parsedUrl.searchParams.get('origin');
      const destination = parsedUrl.searchParams.get('destination');
      const date = parsedUrl.searchParams.get('date');
      const cabinClass = parsedUrl.searchParams.get('cabinClass') || 'economy';
      const currency = parsedUrl.searchParams.get('currency') || 'INR';
      const filter = parsedUrl.searchParams.get('filter') || '';

      if (!origin || !destination || !date) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required parameters: origin, destination, and date.' }));
        return;
      }

      try {
        const payload = await searchFlightsService({
          origin,
          destination,
          date,
          cabinClass,
          currency,
          filter,
          env: process.env,
        });

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'X-Cache': payload.meta?.cached ? 'HIT' : 'MISS',
        });
        res.end(JSON.stringify(payload));
      } catch (err) {
        console.error('[Production API Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process flight search', detail: err.message }));
      }
      return;
    }

    // Route: POST /api/notifications/email
    if (pathname === '/api/notifications/email' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          const data = JSON.parse(body || '{}');
          const { recipient, email, type, flight, targetPrice, currentPrice, currency, bookingUrl } = data;
          const toEmail = recipient || email;

          if (!toEmail || !flight) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'recipient email and flight details are required.' }));
            return;
          }

          const result = await sendFlightAlertEmail({
            recipient: toEmail,
            type: type || 'track_confirmation',
            flight,
            targetPrice: targetPrice ?? flight.currentPrice,
            currentPrice: currentPrice ?? flight.currentPrice,
            currency: currency || 'INR',
            bookingUrl,
            env: process.env,
          });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok', ...result }));
        } catch (err) {
          console.error('[Email Dispatch Error]:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to send alert email', detail: err.message }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
    return;
  }

  // 2. Serve Static Frontend Bundle from dist/
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(DIST_DIR, safePath === '/' ? 'index.html' : safePath);

  // Security check: ensure path is inside DIST_DIR
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback: serve dist/index.html for client-side routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Build output not found. Please run "npm run build" first.');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const headers = { 'Content-Type': contentType };

    if (ext === '.html') {
      headers['Cache-Control'] = 'no-cache';
    } else {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`[AirFare Production Server] Running at http://localhost:${PORT}`);
});
