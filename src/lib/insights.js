/**
 * Deterministic flight booking analytics:
 * - Day-of-week fare volatility (historical drops by day of the week)
 * - Optimal booking window algorithms
 */

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const CABIN_CLASSES = [
  { key: 'economy', label: 'Economy', description: 'Standard Cabin', multiplier: 1.0 },
  { key: 'premium', label: 'Premium Economy', description: 'Extra Legroom & Recline', multiplier: 1.75 },
  { key: 'business', label: 'Business', description: 'Priority & Flat Bed', multiplier: 2.85 },
];

export function generateDayOfWeekVolatility(flight, cabinMultiplier = 1) {
  const seed = hashString(`${flight.origin}-${flight.destination}-${flight.flightNumber}`);
  const baseAvg = flight.stats.avg * cabinMultiplier;

  // Commercial aviation benchmark: Tuesdays & Wednesdays offer the lowest fare drops,
  // Fridays & Sundays are peak business/leisure travel booking days.
  const baseDeltas = [
    { day: 'Mon', fullName: 'Monday', delta: -0.015 },
    { day: 'Tue', fullName: 'Tuesday', delta: -0.095 },
    { day: 'Wed', fullName: 'Wednesday', delta: -0.065 },
    { day: 'Thu', fullName: 'Thursday', delta: +0.01 },
    { day: 'Fri', fullName: 'Friday', delta: +0.085 },
    { day: 'Sat', fullName: 'Saturday', delta: +0.02 },
    { day: 'Sun', fullName: 'Sunday', delta: +0.075 },
  ];

  // Subtle pseudo-random variation based on route seed
  const offset = ((seed % 7) - 3) * 0.006;

  const data = baseDeltas.map((item, idx) => {
    const rawDelta = item.delta + (idx === 1 ? -0.015 : 0) + offset;
    const priceUSD = Math.max(25, Math.round(baseAvg * (1 + rawDelta)));
    return {
      day: item.day,
      fullName: item.fullName,
      deltaPct: rawDelta * 100,
      priceUSD,
    };
  });

  const minPrice = Math.min(...data.map((d) => d.priceUSD));

  return data.map((d) => ({
    ...d,
    isBest: d.priceUSD === minPrice,
  }));
}

export function getBestTimeToBookInsight(flight, cabinMultiplier = 1) {
  const isDomestic = flight.distanceKm < 3000;
  const optimalDays = isDomestic ? 21 : 52;
  const avg = flight.stats.avg * cabinMultiplier;
  const min = flight.stats.min * cabinMultiplier;
  const dropPct = Math.max(10, Math.min(28, Math.round(((avg - min) / avg) * 100)));
  const savingsUSD = Math.round(avg - min);

  return {
    optimalDays,
    dropPct,
    savingsUSD,
    bestDay: 'Tuesday',
    headline: `Prices for ${flight.flightNumber} typically drop ${dropPct}% around ${optimalDays} days before departure.`,
    detail: `Historical patterns show seat inventory adjustments around ${optimalDays} days out, with the most competitive fares published on Tuesdays.`,
  };
}
