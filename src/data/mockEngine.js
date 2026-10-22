import { AIRPORT_BY_CODE } from './airports.js';
import { AIRLINES } from './airlines.js';
import { getBookingUrl } from '../lib/bookingUrls.js';

/* -------------------------------------------------------------------------- */
/*  Deterministic randomness: the same route + date always yields the same    */
/*  flights, so results feel "real" across re-searches and reloads.           */
/* -------------------------------------------------------------------------- */

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (rng, min, max) => min + rng() * (max - min);
const intBetween = (rng, min, max) => Math.floor(between(rng, min, max + 1));
const roundTo = (n, step) => Math.round(n / step) * step;

function shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* -------------------------------------------------------------------------- */
/*  Geography helpers                                                          */
/* -------------------------------------------------------------------------- */

function distanceKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Block time in minutes for a single leg, including taxi/climb overhead. */
function legMinutes(km) {
  const cruise = km < 1500 ? 700 : 840; // km/h
  return roundTo((km / cruise) * 60 + 28, 5);
}

/* -------------------------------------------------------------------------- */
/*  Date / time helpers                                                        */
/* -------------------------------------------------------------------------- */

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const pad = (n) => String(n).padStart(2, '0');
const minutesToClock = (mins) => {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
};

export function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/* -------------------------------------------------------------------------- */
/*  Itinerary candidates                                                       */
/* -------------------------------------------------------------------------- */

const MAX_NONSTOP_KM = 14500;
/** Low-cost carriers that realistically operate international sectors. */
const INTL_LCC = new Set(['6E', 'IX', 'B6', 'FZ', 'G9']);

/**
 * Validates whether an airline legitimately serves the given route.
 * Prevents airlines from appearing on routes they do not operate (e.g. Akasa Air on Delhi-Ranchi).
 */
export function canAirlineFlyRoute(airline, originCode, destCode) {
  if (!airline) return false;
  // If airline explicitly defines its destination network (e.g. Akasa Air, SpiceJet):
  if (airline.destinations && Array.isArray(airline.destinations)) {
    return airline.destinations.includes(originCode) && airline.destinations.includes(destCode);
  }
  // Major national network carriers (e.g. IndiGo, Air India) serve all domestic airports from their hubs
  if (airline.hubs && Array.isArray(airline.hubs)) {
    return true;
  }
  return true;
}

export function canAirlineFlyConnectingRoute(airline, originCode, hubCode, destCode) {
  if (!airline) return false;
  if (!airline.hubs || !airline.hubs.includes(hubCode)) return false;
  if (airline.destinations && Array.isArray(airline.destinations)) {
    return (
      airline.destinations.includes(originCode) &&
      airline.destinations.includes(hubCode) &&
      airline.destinations.includes(destCode)
    );
  }
  return true;
}

function buildCandidates(origin, dest, km) {
  const domestic = origin.country === dest.country;
  const all = Object.values(AIRLINES);
  const candidates = [];

  if (domestic) {
    let local = all.filter((a) => a.country === origin.country);
    if (local.length === 0) {
      local = all.filter((a) => a.tier === 'full' || a.tier === 'lcc');
    }

    // 1. Nonstop flights ONLY for airlines that legitimately fly between origin and destination!
    local.forEach((airline) => {
      if (canAirlineFlyRoute(airline, origin.code, dest.code)) {
        const priority = airline.code === '6E' || airline.code === 'AI' ? 3 : 2;
        candidates.push({ airline, via: null, priority });
      }
    });

    // 2. Connecting options through legitimate domestic hubs where airline serves all 3 points
    local.forEach((airline) => {
      airline.hubs
        .filter((h) => h !== origin.code && h !== dest.code)
        .forEach((h) => {
          if (canAirlineFlyConnectingRoute(airline, origin.code, h, dest.code)) {
            const hub = AIRPORT_BY_CODE[h];
            if (hub) {
              const ratio = (distanceKm(origin, hub) + distanceKm(hub, dest)) / km;
              if (ratio < 1.7) candidates.push({ airline, via: h, priority: ratio < 1.3 ? 1 : 0 });
            }
          }
        });
    });

    // Fallback: only if no candidate passed, use universal flag carriers (AI, 6E)
    if (candidates.length === 0) {
      local
        .filter((a) => a.code === '6E' || a.code === 'AI')
        .forEach((airline) => {
          candidates.push({ airline, via: null, priority: 1 });
        });
    }

    return candidates;
  }

  // International:
  // Home carriers of either country fly nonstop where range allows and route is served.
  all
    .filter((a) => a.country === origin.country || a.country === dest.country)
    .filter((a) => a.tier !== 'lcc' || (INTL_LCC.has(a.code) && km < 6000))
    .forEach((airline) => {
      if (canAirlineFlyRoute(airline, origin.code, dest.code)) {
        if (km <= MAX_NONSTOP_KM) {
          candidates.push({ airline, via: null, priority: 3 });
        }
      }
      airline.hubs
        .filter((h) => h !== origin.code && h !== dest.code)
        .forEach((hubCode) => {
          if (canAirlineFlyConnectingRoute(airline, origin.code, hubCode, dest.code)) {
            const hub = AIRPORT_BY_CODE[hubCode];
            if (hub) {
              const ratio = (distanceKm(origin, hub) + distanceKm(hub, dest)) / km;
              if (ratio < 1.7) candidates.push({ airline, via: hubCode, priority: 2 });
            }
          }
        });
    });

  // Third-country hub carriers (Emirates via DXB, Qatar via DOH, Lufthansa via FRA, etc.)
  all
    .filter((a) => a.country !== origin.country && a.country !== dest.country && a.tier !== 'lcc')
    .forEach((airline) => {
      airline.hubs.forEach((hubCode) => {
        if (hubCode === origin.code || hubCode === dest.code) return;
        if (canAirlineFlyConnectingRoute(airline, origin.code, hubCode, dest.code)) {
          const hub = AIRPORT_BY_CODE[hubCode];
          if (hub) {
            const ratio = (distanceKm(origin, hub) + distanceKm(hub, dest)) / km;
            if (ratio < 1.7) candidates.push({ airline, via: hubCode, priority: ratio < 1.3 ? 1 : 0 });
          }
        }
      });
    });

  if (candidates.length === 0) {
    all
      .filter((a) => a.code === 'AI' || a.code === 'BA' || a.code === 'EK' || a.code === 'LH')
      .forEach((airline) => {
        candidates.push({ airline, via: null, priority: 0 });
      });
  }

  return candidates;
}

/* -------------------------------------------------------------------------- */
/*  Pricing & history                                                          */
/* -------------------------------------------------------------------------- */

const TIER_MULTIPLIER = { lcc: 0.86, full: 1.15, premium: 1.32 };

function basePriceUSD({ km, domestic, airline, stops, daysToDeparture, rng }) {
  let price = domestic ? 28 + km * 0.055 : 110 + km * 0.068;
  price *= TIER_MULTIPLIER[airline.tier];
  price *= stops ? between(rng, 0.8, 0.92) : domestic ? 1 : 1.08;
  // Last-minute premium: fares climb sharply inside ~3 weeks.
  if (daysToDeparture < 21) price *= 1 + (21 - Math.max(daysToDeparture, 0)) * 0.022;
  price *= between(rng, 0.9, 1.12);
  return Math.max(29, Math.round(price));
}

/**
 * 60-day price history ending today. A mean-reverting random walk with an upward
 * drift (as departure nears) and occasional fare-bucket jumps, rescaled so the
 * final point equals the current fare.
 */
function buildHistory({ currentPrice, today, daysToDeparture, rng }) {
  const DAYS = 60;
  const series = [];
  let p = 100 * between(rng, 0.82, 1.04);
  const drift = daysToDeparture < 30 ? 0.35 : 0.06;

  for (let i = 0; i < DAYS; i++) {
    const noise = (rng() - 0.5) * 3.2;
    const revert = (100 - p) * 0.06;
    let jump = 0;
    const roll = rng();
    if (roll < 0.07) jump = between(rng, 5, 11); // bucket sold out
    else if (roll < 0.11) jump = -between(rng, 5, 10); // flash sale / seat release
    p = Math.max(55, p + drift + noise + revert + jump);
    series.push(p);
  }

  const scale = currentPrice / series[DAYS - 1];
  return series.map((v, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (DAYS - 1 - i));
    return { date: toISODate(d), price: i === DAYS - 1 ? currentPrice : Math.round(v * scale) };
  });
}

export function summarizeHistory(history, currentPrice = history[history.length - 1]?.price, daysToDeparture = 30) {
  if (!history || history.length === 0) {
    return { min: 0, minDate: '', max: 0, maxDate: '', avg: 0, change: 0, changePct: 0, recommendation: { action: 'Buy', label: 'Buy Now', tone: 'emerald', reason: 'Best available fare' } };
  }

  let minItem = history[0];
  let maxItem = history[0];
  let sum = 0;

  for (const item of history) {
    sum += item.price;
    if (item.price < minItem.price) minItem = item;
    if (item.price > maxItem.price) maxItem = item;
  }

  const avg = Math.round(sum / history.length);
  const first = history[0].price;
  const last = history[history.length - 1].price;
  const change = last - first;
  const changePct = first > 0 ? ((last - first) / first) * 100 : 0;

  // Recommendation engine
  let recommendation;
  if (currentPrice <= avg * 0.95 || daysToDeparture <= 14) {
    recommendation = {
      action: 'Buy',
      label: 'Buy Now',
      tone: 'emerald',
      reason: currentPrice <= avg * 0.95
        ? `Fare is ${Math.round(((avg - currentPrice) / avg) * 100)}% below average`
        : 'Departure date is close; fares typically rise',
    };
  } else if (currentPrice >= avg * 1.06 && daysToDeparture > 21) {
    recommendation = {
      action: 'Wait',
      label: 'Wait',
      tone: 'amber',
      reason: `Fare is ${Math.round(((currentPrice - avg) / avg) * 100)}% above average; likely to cool down`,
    };
  } else {
    const recent7 = history.slice(-7);
    const trend7 = recent7[recent7.length - 1].price - recent7[0].price;
    if (trend7 > 0) {
      recommendation = {
        action: 'Buy',
        label: 'Buy Now',
        tone: 'emerald',
        reason: 'Price has climbed over the last 7 days',
      };
    } else {
      recommendation = {
        action: 'Wait',
        label: 'Wait',
        tone: 'amber',
        reason: 'Price is stable; wait for promotional drops',
      };
    }
  }

  return {
    min: minItem.price,
    minDate: minItem.date,
    max: maxItem.price,
    maxDate: maxItem.date,
    avg,
    change,
    changePct,
    recommendation,
  };
}

/* -------------------------------------------------------------------------- */
/*  Flight number filter                                                       */
/* -------------------------------------------------------------------------- */

const normalize = (s) => s.toUpperCase().replace(/[\s-]/g, '');

/** Parses "AI-805", "6e 2134", "UA82" → { airline, number } when the carrier is known. */
export function parseFlightNumber(input) {
  const m = normalize(input).match(/^([A-Z0-9]{2})(\d{1,4})$/);
  if (!m || !AIRLINES[m[1]]) return null;
  return { airline: AIRLINES[m[1]], number: Number(m[2]) };
}

function matchesFilter(flight, filter) {
  const q = filter.trim().toLowerCase();
  if (!q) return true;
  const nq = normalize(filter);
  return (
    flight.airline.name.toLowerCase().includes(q) ||
    flight.airline.code.toUpperCase() === nq ||
    normalize(flight.flightNumber).includes(nq)
  );
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Platform Offers Generator (OTAs & Airline Direct)                         */
/* -------------------------------------------------------------------------- */

export const PLATFORM_TEMPLATES = [
  {
    id: 'direct',
    isDirect: true,
    perks: ['Direct Airline Booking', 'Free Seat Selection', 'Priority Check-in'],
    promo: null,
    baseOffset: 0.015,
    taxRate: 0.16,
  },
  {
    id: 'makemytrip',
    platformName: 'MakeMyTrip',
    badgeColor: '#e41d2d',
    logoText: 'MMT',
    isDirect: false,
    perks: ['Instant Refund Guarantee', 'Zero Convenience Fee on UPI'],
    promo: { code: 'MMTFLY', discountPct: 0.045 },
    baseOffset: -0.045,
    taxRate: 0.14,
  },
  {
    id: 'cleartrip',
    platformName: 'Cleartrip',
    badgeColor: '#ff6a00',
    logoText: 'CT',
    isDirect: false,
    perks: ['MediCancel Refund Guarantee', 'Easy Web Check-in'],
    promo: { code: 'CTAIR', discountPct: 0.035 },
    baseOffset: -0.02,
    taxRate: 0.145,
  },
  {
    id: 'skyscanner',
    platformName: 'Skyscanner',
    badgeColor: '#00a3e0',
    logoText: 'SKY',
    isDirect: false,
    perks: ['Price Match Promise', 'No Hidden Fees'],
    promo: null,
    baseOffset: -0.005,
    taxRate: 0.155,
  },
  {
    id: 'ixigo',
    platformName: 'Ixigo',
    badgeColor: '#ea2340',
    logoText: 'IXI',
    isDirect: false,
    perks: ['Free Flight Reschedule', 'Instant UPI Cashback'],
    promo: { code: 'IXICASH', discountPct: 0.03 },
    baseOffset: 0.035,
    taxRate: 0.145,
  },
  {
    id: 'yatra',
    platformName: 'Yatra',
    badgeColor: '#e91e63',
    logoText: 'YAT',
    isDirect: false,
    perks: ['Standard Booking', 'Flexible Date Change'],
    promo: { code: 'YATRA26', discountPct: 0.02 },
    baseOffset: 0.065,
    taxRate: 0.165,
  },
];

export function generatePlatformOffers(flight, cabinMultiplier = 1, cabinClass = 'economy') {
  const currentBase = (flight?.currentPrice ?? 100) * cabinMultiplier;

  return PLATFORM_TEMPLATES.map((tpl) => {
    // Unique deterministic jitter per platform & flight (between -0.03 and +0.03)
    const platSeed = hashString(`${flight?.id ?? 'flight'}-${tpl.id}`);
    const jitter = ((platSeed % 11) - 5) * 0.007;

    // Direct platform takes airline name and color
    const platformName = tpl.isDirect ? `${flight?.airline?.name ?? 'Airline'} Direct` : tpl.platformName;
    const badgeColor = tpl.isDirect ? flight?.airline?.color ?? '#1e293b' : tpl.badgeColor;
    const logoText = tpl.isDirect ? flight?.airline?.code ?? 'AIR' : tpl.logoText;

    // Platform pricing calculation
    const multiplier = 1 + tpl.baseOffset + jitter;
    const preTaxTotal = Math.max(25, Math.round(currentBase * multiplier));

    // Split into base fare and taxes & fees
    const taxesAndFees = Math.max(8, Math.round(preTaxTotal * tpl.taxRate));
    const baseFare = preTaxTotal - taxesAndFees;

    // Calculate promo discount if applicable
    const promoDiscount = tpl.promo ? Math.max(3, Math.round(preTaxTotal * tpl.promo.discountPct)) : 0;
    const totalPrice = preTaxTotal - promoDiscount;

    return {
      id: tpl.id,
      platformName,
      badgeColor,
      logoText,
      isDirect: tpl.isDirect,
      baseFare,
      taxesAndFees,
      promoCode: tpl.promo ? { code: tpl.promo.code, discountUSD: promoDiscount } : null,
      totalPrice,
      perks: tpl.perks,
      bookingUrl: getBookingUrl(tpl.id, flight?.airline, flight?.origin, flight?.destination, flight?.date, cabinClass),
    };
  });
}

function makeFlight({ candidate, origin, dest, km, domestic, departureDate, today, daysToDeparture, rng, depMinutes, number }) {
  const { airline, via } = candidate;
  const hub = via ? AIRPORT_BY_CODE[via] : null;

  let duration;
  let layover = 0;
  if (hub) {
    layover = roundTo(between(rng, 70, 230), 5);
    duration = legMinutes(distanceKm(origin, hub)) + layover + legMinutes(distanceKm(hub, dest));
  } else {
    duration = legMinutes(km) + roundTo(between(rng, -10, 15), 5); // schedule padding varies by carrier
  }

  const dep = depMinutes ?? roundTo(between(rng, 5 * 60, 23 * 60 + 30), 5);
  const arrLocal = dep + duration + Math.round((dest.tz - origin.tz) * 60);
  const dayOffset = Math.floor(arrLocal / 1440);

  const flightNo = number ?? intBetween(rng, airline.numRange[0], airline.numRange[1]);
  const stops = hub ? 1 : 0;
  const currentPrice = basePriceUSD({ km, domestic, airline, stops, daysToDeparture, rng });
  const history = buildHistory({ currentPrice, today, daysToDeparture, rng });

  return {
    id: `${airline.code}-${flightNo}-${departureDate}`,
    airline,
    flightNumber: `${airline.code}-${flightNo}`,
    origin: origin.code,
    destination: dest.code,
    date: departureDate,
    departureTime: minutesToClock(dep),
    arrivalTime: minutesToClock(arrLocal),
    arrivalDayOffset: dayOffset,
    departureMinutes: dep,
    durationMinutes: duration,
    duration: formatDuration(duration),
    stops,
    via: via ?? null,
    layoverMinutes: layover,
    distanceKm: Math.round(km),
    aircraft: km > 5000 ? (rng() > 0.5 ? 'Boeing 787-9' : 'Airbus A350-900') : rng() > 0.5 ? 'Airbus A320neo' : 'Boeing 737 MAX 8',
    currentPrice,
    history,
    stats: summarizeHistory(history, currentPrice, daysToDeparture),
    platformOffers: generatePlatformOffers({
      id: `${airline.code}-${flightNo}-${departureDate}`,
      airline,
      flightNumber: `${airline.code}-${flightNo}`,
      origin: origin.code,
      destination: dest.code,
      currentPrice,
      date: departureDate,
    }, 1),
  };
}

/**
 * Generate 6–8 realistic flights for a route on a given date.
 * Prices are in USD; convert at the presentation layer.
 *
 * @param {{ origin: string, destination: string, date: string, filter?: string }} params
 */
export function generateFlights({ origin, destination, date, filter = '' }) {
  const o = AIRPORT_BY_CODE[origin];
  const d = AIRPORT_BY_CODE[destination];
  if (!o || !d || o.code === d.code) return [];

  const rng = mulberry32(hashString(`${o.code}|${d.code}|${date}`));
  const km = distanceKm(o, d);
  const domestic = o.country === d.country;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysToDeparture = Math.round((parseISODate(date) - today) / 86_400_000);

  // Order: nonstop home carriers first, then good connections, then the rest.
  let candidates = shuffle(rng, buildCandidates(o, d, km)).sort((a, b) => b.priority - a.priority);
  if (candidates.length === 0) {
    candidates = [
      { airline: AIRLINES['AI'], via: null, priority: 1 },
      { airline: AIRLINES['6E'], via: null, priority: 1 },
    ];
  }

  // Generate a realistic daily flight timetable based on verified carrier presence:
  const carrierCount = new Set(candidates.map((c) => c.airline.code)).size;
  const isTrunk = ((o.country === 'IN' && d.country === 'IN') || km < 2400) && carrierCount >= 3;
  const count = isTrunk
    ? intBetween(rng, 32, 42)
    : carrierCount <= 2
    ? intBetween(rng, 8, 12)
    : intBetween(rng, 18, 26);

  const startMinute = 5 * 60;       // 05:00 AM (Early morning flights)
  const endMinute = 23 * 60 + 35;   // 11:35 PM (Late night red-eye flights)
  const step = (endMinute - startMinute) / count;

  // Build a weighted candidate pool so all candidate airlines are represented,
  // with primary airlines (e.g. 6E, AI) having higher frequencies.
  const pool = [];
  for (const cand of candidates) {
    const weight = cand.priority === 3 ? 4 : cand.priority === 2 ? 3 : cand.priority === 1 ? 2 : 1;
    for (let w = 0; w < weight; w++) {
      pool.push(cand);
    }
  }
  const shuffledPool = shuffle(rng, pool);

  const picked = [];
  for (let idx = 0; idx < count; idx++) {
    picked.push(shuffledPool[idx % shuffledPool.length]);
  }

  const usedNumbers = new Set();
  const flights = picked.map((candidate, idx) => {
    // Generate realistic, evenly distributed departure times with slight jitter
    const depSlot = roundTo(startMinute + idx * step + between(rng, -8, 8), 5);
    const depMinutes = Math.min(23 * 60 + 45, Math.max(5 * 60, depSlot));

    let flight;
    let attempts = 0;
    do {
      attempts++;
      flight = makeFlight({
        candidate,
        origin: o,
        dest: d,
        km,
        domestic,
        departureDate: date,
        today,
        daysToDeparture,
        rng,
        depMinutes,
      });
    } while (usedNumbers.has(flight.flightNumber) && attempts < 50);
    usedNumbers.add(flight.flightNumber);
    return flight;
  });

  // If the user asked for a specific flight number on a valid carrier, make sure it exists.
  const parsed = filter ? parseFlightNumber(filter) : null;
  if (parsed && !flights.some((f) => normalize(f.flightNumber) === normalize(filter))) {
    const candidate = candidates.find((c) => c.airline.code === parsed.airline.code) ?? { airline: parsed.airline, via: null };
    const flightRng = mulberry32(hashString(`${o.code}|${d.code}|${date}|${parsed.airline.code}${parsed.number}`));
    flights.push(
      makeFlight({ candidate, origin: o, dest: d, km, domestic, departureDate: date, today, daysToDeparture, rng: flightRng, number: parsed.number }),
    );
  }

  return flights.filter((f) => matchesFilter(f, filter)).sort((a, b) => a.departureMinutes - b.departureMinutes);
}
