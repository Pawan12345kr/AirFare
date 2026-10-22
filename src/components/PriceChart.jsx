import { memo, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CURRENCIES, convertPrice, formatPrice } from '../lib/currency.js';

export const TIMEFRAMES = [
  { key: '7D', days: 7, label: '7D' },
  { key: '14D', days: 14, label: '14D' },
  { key: '30D', days: 30, label: '30D' },
  { key: '60D', days: 60, label: '60D' },
];

function formatXAxisDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTooltipDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function CustomGlassTooltip({ active, payload, currency, avgPriceUSD }) {
  if (!active || !payload || !payload.length) return null;

  const dataPoint = payload[0].payload;
  const originalPriceUSD = dataPoint.price;
  const diffPct = avgPriceUSD ? ((originalPriceUSD - avgPriceUSD) / avgPriceUSD) * 100 : 0;
  const isBelowAvg = diffPct < -0.5;
  const isAboveAvg = diffPct > 0.5;

  return (
    <div className="animate-fade-up rounded-xl border border-white/70 bg-white/90 p-3.5 shadow-xl shadow-slate-900/10 backdrop-blur-md ring-1 ring-slate-900/5">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-indigo-600 shadow-sm shadow-indigo-500/50" />
        <span className="text-xs font-medium text-slate-500">{formatTooltipDate(dataPoint.date)}</span>
      </div>

      <div className="mt-1.5 flex items-baseline gap-2.5">
        <span className="text-xl font-bold tabular-nums tracking-tight text-slate-900">
          {formatPrice(originalPriceUSD, currency)}
        </span>
        <span
          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
            isBelowAvg
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
              : isAboveAvg
              ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
              : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20'
          }`}
        >
          {diffPct > 0 ? `+${diffPct.toFixed(1)}%` : `${diffPct.toFixed(1)}%`} vs avg
        </span>
      </div>

      <p className="mt-1 text-[11px] text-slate-400">
        {dataPoint.daysAgo === 0 ? 'Today (Latest Fare)' : `${dataPoint.daysAgo} days ago`}
      </p>
    </div>
  );
}

function PriceChart({
  history,
  currency,
  timeframe,
  onTimeframeChange,
  avgPriceUSD,
  cabinLabel = 'Economy',
  targetPriceUSD = null,
  hoveredPlatform = null,
}) {
  const c = CURRENCIES[currency] ?? CURRENCIES.USD;

  // Slice history according to selected timeframe (7D, 14D, 30D, 60D)
  const chartData = useMemo(() => {
    const tf = TIMEFRAMES.find((t) => t.key === timeframe) ?? TIMEFRAMES[2];
    const sliced = history.slice(-tf.days);
    const totalCount = sliced.length;

    return sliced.map((item, idx) => ({
      ...item,
      convertedPrice: convertPrice(item.price, currency),
      daysAgo: totalCount - 1 - idx,
    }));
  }, [history, timeframe, currency]);

  const convertedAvg = useMemo(() => {
    return convertPrice(avgPriceUSD, currency);
  }, [avgPriceUSD, currency]);

  const convertedTarget = useMemo(() => {
    return targetPriceUSD != null ? convertPrice(targetPriceUSD, currency) : null;
  }, [targetPriceUSD, currency]);

  const convertedHovered = useMemo(() => {
    return hoveredPlatform?.priceUSD != null ? convertPrice(hoveredPlatform.priceUSD, currency) : null;
  }, [hoveredPlatform, currency]);

  // Dynamic Y domain with padding, including target and hovered platform prices if present
  const [minPrice, maxPrice] = useMemo(() => {
    if (!chartData.length) return [0, 100];
    const prices = chartData.map((d) => d.convertedPrice);
    if (convertedTarget != null) prices.push(convertedTarget);
    if (convertedHovered != null) prices.push(convertedHovered);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const pad = Math.max(1, Math.round((max - min) * 0.15));
    return [Math.max(0, min - pad), max + pad];
  }, [chartData, convertedTarget, convertedHovered]);

  return (
    <div className="p-5">
      {/* Chart Header with Timeframe toggles */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Fare Variation Over Time</h3>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
              {cabinLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500">Historical price movement leading up to today</p>
        </div>

        {/* Timeframe toggle pills */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50/80 p-0.5">
          {TIMEFRAMES.map((tf) => {
            const active = tf.key === timeframe;
            return (
              <button
                key={tf.key}
                type="button"
                onClick={() => onTimeframeChange(tf.key)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums transition-all ${
                  active
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Area Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 16, right: 12, left: -4, bottom: 0 }}>
            <defs>
              <linearGradient id="fareAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisDate}
              stroke="#94a3b8"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: '#f1f5f9' }}
              dy={6}
            />

            <YAxis
              domain={[minPrice, maxPrice]}
              tickFormatter={(val) => {
                const symbol = c.symbol;
                if (val >= 1000) {
                  return `${symbol}${Math.round(val / 1000)}k`;
                }
                return `${symbol}${val}`;
              }}
              stroke="#94a3b8"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              dx={-4}
            />

            <Tooltip
              content={<CustomGlassTooltip currency={currency} avgPriceUSD={avgPriceUSD} />}
              cursor={{ stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />

            {/* Dashed Average Price ReferenceLine */}
            <ReferenceLine
              y={convertedAvg}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Avg ${formatPrice(avgPriceUSD, currency)}`,
                position: 'insideTopRight',
                fill: '#64748b',
                fontSize: 11,
                fontWeight: 600,
                offset: 10,
              }}
            />

            {/* Green Dashed Target Price ReferenceLine */}
            {convertedTarget != null && (
              <ReferenceLine
                y={convertedTarget}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={1.75}
                label={{
                  value: `Target: ${formatPrice(targetPriceUSD, currency)}`,
                  position: 'insideBottomRight',
                  fill: '#059669',
                  fontSize: 11,
                  fontWeight: 600,
                  offset: 8,
                }}
              />
            )}

            {/* Dotted Platform Hover ReferenceLine */}
            {convertedHovered != null && (
              <ReferenceLine
                y={convertedHovered}
                stroke="#6366f1"
                strokeDasharray="2 3"
                strokeWidth={2}
                label={{
                  value: `${hoveredPlatform.name}: ${formatPrice(hoveredPlatform.priceUSD, currency)}`,
                  position: 'insideTopLeft',
                  fill: '#4338ca',
                  fontSize: 11,
                  fontWeight: 700,
                  offset: 8,
                }}
              />
            )}

            {/* Smooth Monotone Area */}
            <Area
              type="monotone"
              dataKey="convertedPrice"
              stroke="#4f46e5"
              strokeWidth={2.25}
              fill="url(#fareAreaGradient)"
              activeDot={{
                r: 5.5,
                stroke: '#4f46e5',
                strokeWidth: 2,
                fill: '#ffffff',
                className: 'shadow-md',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            Fare curve
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 bg-slate-400 border-t border-dashed border-slate-400" />
            Average price ({timeframe})
          </span>
          {convertedTarget != null && (
            <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
              <span className="h-0.5 w-3 bg-emerald-500 border-t border-dashed border-emerald-500" />
              Target Alert ({formatPrice(targetPriceUSD, currency)})
            </span>
          )}
          {convertedHovered != null && (
            <span className="flex items-center gap-1.5 font-bold text-indigo-700 animate-pulse">
              <span className="h-0.5 w-3 bg-indigo-600 border-t border-dotted border-indigo-600" />
              {hoveredPlatform.name} ({formatPrice(hoveredPlatform.priceUSD, currency)})
            </span>
          )}
        </div>
        <span>Hover over curve to inspect daily prices</span>
      </div>
    </div>
  );
}

export default memo(PriceChart);
