/**
 * Classifies a fare against its own 30-day average.
 * Within ±5% of the average is considered "Average".
 */
export const PRICE_LEVELS = {
  low: {
    key: 'low',
    label: 'Low Price',
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dot: 'bg-emerald-500',
    hex: '#059669',
  },
  average: {
    key: 'average',
    label: 'Average',
    pill: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    dot: 'bg-amber-500',
    hex: '#d97706',
  },
  high: {
    key: 'high',
    label: 'High',
    pill: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    dot: 'bg-rose-500',
    hex: '#e11d48',
  },
};

const THRESHOLD = 0.05;

export function getPriceLevel(flight) {
  const { avg } = flight.stats;
  const delta = (flight.currentPrice - avg) / avg;
  const level = delta <= -THRESHOLD ? PRICE_LEVELS.low : delta >= THRESHOLD ? PRICE_LEVELS.high : PRICE_LEVELS.average;
  return { ...level, deltaPct: delta * 100 };
}
