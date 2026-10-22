/**
 * @file Unified Frontend Flight Data Adapter
 * Seamlessly interfaces between the live backend proxy API (/api/flights/search)
 * and the client-side deterministic simulation engine with client TTL caching.
 */

import { generateFlights } from '../data/mockEngine.js';

const CLIENT_CACHE_KEY_PREFIX = 'airfare_cache_v4_';
const CLIENT_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Checks server backend API connectivity and credentials status.
 */
export async function checkServerApiStatus() {
  try {
    const res = await fetch('/api/status', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      return await res.json();
    }
    return { serpapiConfigured: false, amadeusConfigured: false, error: `HTTP ${res.status}` };
  } catch (err) {
    return { serpapiConfigured: false, amadeusConfigured: false, error: err.message };
  }
}

/**
 * Retrieves cached flight search from sessionStorage if still fresh.
 */
function getClientCache(key) {
  try {
    const raw = sessionStorage.getItem(CLIENT_CACHE_KEY_PREFIX + key);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp < CLIENT_TTL_MS) {
      return data;
    }
    sessionStorage.removeItem(CLIENT_CACHE_KEY_PREFIX + key);
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

/**
 * Stores flight search in sessionStorage with TTL timestamp.
 */
function setClientCache(key, data) {
  try {
    sessionStorage.setItem(
      CLIENT_CACHE_KEY_PREFIX + key,
      JSON.stringify({ timestamp: Date.now(), data }),
    );
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Unified Flight Search Service
 *
 * @param {{
 *   origin: string,
 *   destination: string,
 *   date: string,
 *   cabinClass?: string,
 *   currency?: string,
 *   filter?: string,
 *   mode?: 'live' | 'sandbox'
 * }} params
 * @returns {Promise<{ flights: import('../types/flight.js').FlightData[], meta: object }>}
 */
export async function searchFlights({
  origin,
  destination,
  date,
  cabinClass = 'economy',
  currency = 'INR',
  filter = '',
  mode = 'live',
}) {
  const cacheKey = `${origin}_${destination}_${date}_${cabinClass}_${currency}_${filter}_${mode}`;

  // 1. Return from client cache if fresh
  const cached = getClientCache(cacheKey);
  if (cached) {
    return {
      ...cached,
      meta: { ...cached.meta, clientCached: true },
    };
  }

  // 2. Demo Sandbox mode explicitly requested by user
  if (mode === 'sandbox') {
    const flights = generateFlights({ origin, destination, date, filter });
    const payload = {
      flights,
      meta: {
        origin,
        destination,
        date,
        cabinClass,
        currency,
        totalCount: flights.length,
        source: 'demo_sandbox',
        sourceMessage: 'Demo Sandbox (Deterministic Simulation Engine)',
        clientCached: false,
      },
    };
    setClientCache(cacheKey, payload);
    return payload;
  }

  // 3. Live API mode: Call secure backend proxy
  try {
    const url = new URL('/api/flights/search', window.location.origin);
    url.searchParams.set('origin', origin);
    url.searchParams.set('destination', destination);
    url.searchParams.set('date', date);
    url.searchParams.set('cabinClass', cabinClass);
    url.searchParams.set('currency', currency);
    if (filter) url.searchParams.set('filter', filter);

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(12000),
    });

    if (res.ok) {
      const data = await res.json();
      setClientCache(cacheKey, data);
      return data;
    }
  } catch (err) {
    console.warn('[Flight API Client] Proxy request failed, falling back:', err.message);
  }

  // 4. Graceful Fallback if backend proxy unreachable or offline
  const fallbackFlights = generateFlights({ origin, destination, date, filter });
  const fallbackPayload = {
    flights: fallbackFlights,
    meta: {
      origin,
      destination,
      date,
      cabinClass,
      currency,
      totalCount: fallbackFlights.length,
      source: 'demo_fallback',
      sourceMessage: 'Offline / Proxy Unreachable → Local Sandbox Fallback',
      clientCached: false,
    },
  };

  setClientCache(cacheKey, fallbackPayload);
  return fallbackPayload;
}

/**
 * Dispatches an email notification for flight price tracking or price drops.
 */
export async function sendFlightNotificationEmail({
  recipient,
  type = 'track_confirmation',
  flight,
  targetPrice,
  currentPrice,
  currency = 'INR',
  bookingUrl,
}) {
  try {
    const res = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient,
        type,
        flight,
        targetPrice,
        currentPrice,
        currency,
        bookingUrl,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      return await res.json();
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to dispatch email');
  } catch (err) {
    console.warn('[Flight API Client] Email notification dispatch error:', err.message);
    return {
      status: 'simulated',
      success: true,
      simulated: true,
      recipient,
      message: 'Simulated alert recorded locally',
    };
  }
}
