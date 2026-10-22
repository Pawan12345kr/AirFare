import { memo, useMemo } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CalendarClock, CheckCircle, Info, Sparkles, TrendingDown } from 'lucide-react';
import { generateDayOfWeekVolatility, getBestTimeToBookInsight } from '../lib/insights.js';
import { CURRENCIES, convertPrice, formatPrice } from '../lib/currency.js';

function VolatilityTooltip({ active, payload, currency, avgUSD }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const isBest = d.isBest;
  const diffPct = d.deltaPct;

  return (
    <div className="animate-fade-up rounded-xl border border-white/70 bg-white/95 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-md ring-1 ring-slate-900/5">
      <div className="flex items-center gap-1.5">
        <span
          className={`h-2 w-2 rounded-full ${
            isBest ? 'bg-emerald-500' : diffPct > 3 ? 'bg-rose-500' : 'bg-indigo-500'
          }`}
        />
        <span className="text-xs font-semibold text-slate-800">{d.fullName}</span>
        {isBest && (
          <span className="ml-auto rounded bg-emerald-50 px-1 py-0.2 text-[10px] font-bold text-emerald-700">
            Lowest Fare
          </span>
        )}
      </div>

      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-base font-bold tabular-nums tracking-tight text-slate-900">
          {formatPrice(d.priceUSD, currency)}
        </span>
        <span
          className={`text-[11px] font-semibold tabular-nums ${
            diffPct < 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {diffPct > 0 ? `+${diffPct.toFixed(1)}%` : `${diffPct.toFixed(1)}%`} vs avg
        </span>
      </div>
    </div>
  );
}

function VolatilityCard({ flight, cabinMultiplier = 1, currency }) {
  const c = CURRENCIES[currency] ?? CURRENCIES.USD;

  const volatilityData = useMemo(() => {
    const raw = generateDayOfWeekVolatility(flight, cabinMultiplier);
    return raw.map((d) => ({
      ...d,
      convertedPrice: convertPrice(d.priceUSD, currency),
    }));
  }, [flight, cabinMultiplier, currency]);

  const bestBookingInsight = useMemo(() => {
    return getBestTimeToBookInsight(flight, cabinMultiplier);
  }, [flight, cabinMultiplier]);

  const bestDay = useMemo(() => {
    return volatilityData.find((d) => d.isBest) ?? volatilityData[1];
  }, [volatilityData]);

  const avgConverted = useMemo(() => {
    const sum = volatilityData.reduce((acc, d) => acc + d.convertedPrice, 0);
    return Math.round(sum / volatilityData.length);
  }, [volatilityData]);

  // Compute dynamic Y domain for compact bar chart
  const [minVal, maxVal] = useMemo(() => {
    const prices = volatilityData.map((d) => d.convertedPrice);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const pad = Math.max(1, Math.round((max - min) * 0.4));
    return [Math.max(0, min - pad), max + Math.round(pad * 0.3)];
  }, [volatilityData]);

  return (
    <div className="border-t border-slate-100 p-5 sm:p-6">
      {/* 1. Header & Title */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Price Volatility by Day of Week
            </h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Cheapest: {bestDay.fullName}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Historical day-of-week price index showing lowest fare drops
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Best deal
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            Standard
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            Weekend peak
          </span>
        </div>
      </div>

      {/* 2. Compact BarChart */}
      <div className="mt-4 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={volatilityData} margin={{ top: 12, right: 8, left: -14, bottom: 0 }}>
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: '#f1f5f9' }}
              dy={4}
            />
            <YAxis
              domain={[minVal, maxVal]}
              tickFormatter={(val) => {
                const s = c.symbol;
                if (val >= 1000) return `${s}${Math.round(val / 1000)}k`;
                return `${s}${val}`;
              }}
              stroke="#94a3b8"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<VolatilityTooltip currency={currency} avgUSD={flight.stats.avg * cabinMultiplier} />}
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
            />
            <ReferenceLine
              y={avgConverted}
              stroke="#cbd5e1"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <Bar dataKey="convertedPrice" radius={[6, 6, 2, 2]} maxBarSize={36}>
              {volatilityData.map((entry, index) => {
                let fill = '#94a3b8';
                if (entry.isBest) fill = '#10b981'; // Emerald for best day
                else if (entry.deltaPct > 4) fill = '#f43f5e'; // Rose for peak weekend
                else if (entry.deltaPct < -3) fill = '#6366f1'; // Indigo for good mid-week
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. "Best Time to Book" Callout Box */}
      <div className="mt-5 overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50/80 p-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <CalendarClock className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Best Time to Book
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <TrendingDown className="h-3 w-3" />
                Up to {bestBookingInsight.dropPct}% off
              </span>
            </div>

            {/* Plain English summary */}
            <p className="mt-1 text-sm font-semibold text-slate-900 leading-snug">
              {bestBookingInsight.headline}
            </p>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {bestBookingInsight.detail}
            </p>

            {/* 3 Quick Data Metric Badges */}
            <div className="mt-3 grid grid-cols-1 gap-2 pt-2 border-t border-indigo-100/60 sm:grid-cols-3">
              <div className="rounded-lg bg-white/80 px-2.5 py-1.5 ring-1 ring-inset ring-slate-200/60">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Optimal Window</p>
                <p className="text-xs font-bold tabular-nums text-slate-800">
                  {bestBookingInsight.optimalDays} days out
                </p>
              </div>

              <div className="rounded-lg bg-white/80 px-2.5 py-1.5 ring-1 ring-inset ring-slate-200/60">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Cheapest Day</p>
                <p className="text-xs font-bold text-emerald-600">
                  {bestDay.fullName}s
                </p>
              </div>

              <div className="rounded-lg bg-white/80 px-2.5 py-1.5 ring-1 ring-inset ring-slate-200/60">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Potential Savings</p>
                <p className="text-xs font-bold tabular-nums text-slate-800">
                  ~{formatPrice(bestBookingInsight.savingsUSD, currency)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(VolatilityCard);
