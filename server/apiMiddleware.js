/**
 * @file Vite Dev Server API Plugin
 * Intercepts `/api/flights/search` and `/api/status` requests natively in Node.js.
 */

import { searchFlightsService, getApiStatus, clearServerCache } from './flightService.js';
import { sendFlightAlertEmail } from './emailService.js';

export function airfareApiPlugin(env = process.env) {
  return {
    name: 'airfare-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');

        // Route 1: GET /api/status
        if (url.pathname === '/api/status' && req.method === 'GET') {
          try {
            const status = getApiStatus(env);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'ok', ...status }));
          } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // Route 2: POST /api/cache/clear
        if (url.pathname === '/api/cache/clear' && req.method === 'POST') {
          try {
            const result = clearServerCache();
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(JSON.stringify(result));
          } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // Route 3: GET /api/flights/search
        if (url.pathname === '/api/flights/search' && req.method === 'GET') {
          const origin = url.searchParams.get('origin');
          const destination = url.searchParams.get('destination');
          const date = url.searchParams.get('date');
          const cabinClass = url.searchParams.get('cabinClass') || 'economy';
          const currency = url.searchParams.get('currency') || 'INR';
          const filter = url.searchParams.get('filter') || '';

          if (!origin || !destination || !date) {
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(400);
            res.end(
              JSON.stringify({
                error: 'Missing required query parameters: origin, destination, and date are required.',
              }),
            );
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
              env,
            });

            res.setHeader('Content-Type', 'application/json');
            if (payload.meta?.cached) {
              res.setHeader('X-Cache', 'HIT');
            } else {
              res.setHeader('X-Cache', 'MISS');
            }

            res.writeHead(200);
            res.end(JSON.stringify(payload));
          } catch (err) {
            console.error('[API Endpoint Error]:', err);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to process flight search', detail: err.message }));
          }
          return;
        }

        // Route 4: POST /api/notifications/email (Flight Price Tracking Alerts)
        if (url.pathname === '/api/notifications/email' && req.method === 'POST') {
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
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(400);
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
                env,
              });

              res.setHeader('Content-Type', 'application/json');
              res.writeHead(200);
              res.end(JSON.stringify({ status: 'ok', ...result }));
            } catch (err) {
              console.error('[Email Dispatch Error]:', err);
              res.setHeader('Content-Type', 'application/json');
              res.writeHead(500);
              res.end(JSON.stringify({ error: 'Failed to send alert email', detail: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}
