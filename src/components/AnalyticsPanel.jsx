import { useMemo, useState } from 'react';
import {
  Armchair,
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  Plane,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { AirlineMark, PriceLevelPill, RouteTimeline } from './FlightCard.jsx';
import PriceChart, { TIMEFRAMES } from './PriceChart.jsx';
import PriceAlertModal from './PriceAlertModal.jsx';
import PlatformComparison from './PlatformComparison.jsx';
import VolatilityCard from './VolatilityCard.jsx';
import { AIRPORT_BY_CODE } from '../data/airports.js';
import { summarizeHistory } from '../data/mockEngine.js';
import { CABIN_CLASSES } from '../lib/insights.js';
import { formatPrice } from '../lib/currency.js';
import { getPriceLevel } from '../lib/pricing.js';

function formatLongDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatShortDateWithYear(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function AnalyticsPanelSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-3 p-5">
        <div className="h-4 w-48 rounded bg-slate-100" />
        <div className="h-8 w-64 rounded bg-slate-100" />
      </div>
      <div className="h-28 border-y border-slate-100 bg-slate-50/60" />
      <div className="m-5 h-72 rounded-lg bg-slate-50" />
    </div>
  );
}

export default function AnalyticsPanel({
  flight,
  currency,
  targetPriceUSD,
  onSaveAlert,
  onRemoveAlert,
}) {
  const [timeframe, setTimeframe] = useState('30D');
  const [cabinClass, setCabinClass] = useState('economy');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [hoveredPlatform, setHoveredPlatform] = useState(null);

  if (!flight) {
    return (
      <div className="flex h-full min-h-96 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <BarChart3 className="h-6 w-6" />
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-900">No flight selected</p>
        <p className="mt-1 text-sm text-slate-500">Select any flight from the list to view its price analytics dashboard.</p>
      </div>
    );
  }

  const o = AIRPORT_BY_CODE[flight.origin];
  const d = AIRPORT_BY_CODE[flight.destination];

  // Active Cabin Class configuration & multiplier
  const activeCabin = useMemo(() => {
    return CABIN_CLASSES.find((c) => c.key === cabinClass) ?? CABIN_CLASSES[0];
  }, [cabinClass]);

  const cabinMultiplier = activeCabin.multiplier;

  // Dynamically scale current price & 60-day historical points based on cabin class
  const scaledCurrentPrice = useMemo(() => {
    return Math.round(flight.currentPrice * cabinMultiplier);
  }, [flight.currentPrice, cabinMultiplier]);

  const scaledHistory = useMemo(() => {
    return flight.history.map((item) => ({
      date: item.date,
      price: Math.round(item.price * cabinMultiplier),
    }));
  }, [flight.history, cabinMultiplier]);

  // Dynamically slice history according to selected timeframe (7D, 14D, 30D, 60D)
  const tfConfig = TIMEFRAMES.find((t) => t.key === timeframe) ?? TIMEFRAMES[2];
  const timeframeHistory = useMemo(() => {
    return scaledHistory.slice(-tfConfig.days);
  }, [scaledHistory, tfConfig.days]);

  // Calculate timeframe statistics and Buy vs. Wait recommendation
  const tfStats = useMemo(() => {
    return summarizeHistory(timeframeHistory, scaledCurrentPrice);
  }, [timeframeHistory, scaledCurrentPrice]);

  const recommendation = tfStats.recommendation;
  const isBuy = recommendation.action === 'Buy';

  // Flight level comparison for the active scaled price
  const level = useMemo(() => {
    const delta = (scaledCurrentPrice - tfStats.avg) / tfStats.avg;
    return {
      deltaPct: delta * 100,
    };
  }, [scaledCurrentPrice, tfStats.avg]);

  return (
    <div
      key={flight.id}
      className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05),0_12px_24px_-12px_rgba(15,23,42,0.08)]"
    >
      {/* 1. Header: Flight Number, Route, and Selected Date */}
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Flight Number & Route */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <AirlineMark airline={flight.airline} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold tabular-nums tracking-wide text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                    {flight.flightNumber}
                  </span>
                  <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                    {flight.airline.name}
                  </h2>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold tabular-nums text-slate-800">{flight.origin}</span>
                  <span className="text-slate-400">({o.city})</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-semibold tabular-nums text-slate-800">{flight.destination}</span>
                  <span className="text-slate-400">({d.city})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Departure Date & Aircraft Info */}
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Departure Date</span>
            <p className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-slate-900 sm:justify-end">
              <CalendarDays className="h-3.5 w-3.5 text-indigo-600" />
              {formatLongDate(flight.date)}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400 sm:justify-end">
              <Plane className="h-3 w-3" />
              {flight.aircraft} <span className="text-slate-300">·</span> {flight.distanceKm.toLocaleString('en-US')} km
            </p>
          </div>
        </div>

        {/* Schedule & Flight Route Strip + Alert Action Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 rounded-xl bg-slate-50/80 p-3.5 ring-1 ring-inset ring-slate-100">
            <RouteTimeline flight={flight} />
          </div>

          <button
            type="button"
            onClick={() => setIsAlertModalOpen(true)}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold shadow-sm transition-all sm:self-stretch ${
              targetPriceUSD != null
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-slate-50'
            }`}
          >
            <BellRing className={`h-4 w-4 shrink-0 ${targetPriceUSD != null ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className="whitespace-nowrap">
              {targetPriceUSD != null
                ? `Alert: ${formatPrice(targetPriceUSD, currency)}`
                : 'Track Fare / Set Alert'}
            </span>
          </button>
        </div>
      </div>

      {/* 4-Card KPI Metric Strip */}
      <div className="grid grid-cols-1 divide-y divide-slate-100 border-b border-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {/* Card a) Current Fare */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Current Fare</span>
            <PriceLevelPill flight={{ ...flight, currentPrice: scaledCurrentPrice, stats: tfStats }} />
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
            {formatPrice(scaledCurrentPrice, currency)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {level.deltaPct <= -0.5 ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <TrendingDown className="h-3.5 w-3.5" />
                {Math.abs(level.deltaPct).toFixed(1)}% below average
              </span>
            ) : level.deltaPct >= 0.5 ? (
              <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                {level.deltaPct.toFixed(1)}% above average
              </span>
            ) : (
              <span className="text-slate-500 font-medium">At typical average fare</span>
            )}
          </p>
        </div>

        {/* Card b) Lowest Recorded Fare (with date) */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Lowest Recorded</span>
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              {timeframe} Low
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-emerald-600">
            {formatPrice(tfStats.min, currency)}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <CalendarDays className="h-3 w-3 text-slate-400" />
            <span className="font-medium text-slate-700">{formatShortDateWithYear(tfStats.minDate)}</span>
          </p>
        </div>

        {/* Card c) Highest Recorded Fare */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Highest Recorded</span>
            <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
              {timeframe} Peak
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-rose-600">
            {formatPrice(tfStats.max, currency)}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <CalendarDays className="h-3 w-3 text-slate-400" />
            <span className="font-medium text-slate-700">{formatShortDateWithYear(tfStats.maxDate)}</span>
          </p>
        </div>

        {/* Card d) Average Fare & "Buy vs. Wait" recommendation badge */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Average Fare</span>
            {/* Recommendation badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
                isBuy
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                  : 'bg-amber-50 text-amber-700 ring-amber-600/20'
              }`}
            >
              {isBuy ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {recommendation.label}
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
            {formatPrice(tfStats.avg, currency)}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500" title={recommendation.reason}>
            {recommendation.reason}
          </p>
        </div>
      </div>

      {/* 2. Cabin Class Segmented Control (Placed above chart) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-2.5">
        <div className="flex items-center gap-2">
          <Armchair className="h-4 w-4 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-700">Cabin Class</span>
          <span className="hidden text-xs text-slate-400 sm:inline">
            · {activeCabin.description}
          </span>
        </div>

        {/* Segmented control pills */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
          {CABIN_CLASSES.map((c) => {
            const active = c.key === cabinClass;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCabinClass(c.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{c.label}</span>
                {c.multiplier !== 1 && (
                  <span
                    className={`rounded px-1 py-0.2 text-[10px] tabular-nums font-semibold ${
                      active ? 'bg-indigo-500/60 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {c.multiplier}x
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Interactive Price Chart (using Recharts) */}
      <PriceChart
        history={scaledHistory}
        currency={currency}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        avgPriceUSD={tfStats.avg}
        cabinLabel={activeCabin.label}
        targetPriceUSD={targetPriceUSD}
        hoveredPlatform={hoveredPlatform}
      />

      {/* 4. Multi-Platform Fare Comparison (OTAs & Airline Direct) */}
      <PlatformComparison
        flight={flight}
        cabinMultiplier={cabinMultiplier}
        cabinClass={cabinClass}
        currency={currency}
        onHoverPlatform={setHoveredPlatform}
        hoveredPlatform={hoveredPlatform}
      />

      {/* 5. Time-of-Day / Booking Window Insight Card */}
      <VolatilityCard
        flight={flight}
        cabinMultiplier={cabinMultiplier}
        currency={currency}
      />

      {/* 6. AirFare Recommendation Callout Banner */}
      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                isBuy ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                AirFare Recommendation: <span className={isBuy ? 'text-emerald-700' : 'text-amber-700'}>{recommendation.label}</span>
              </p>
              <p className="text-[11px] text-slate-500">{recommendation.reason}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info className="h-3.5 w-3.5 text-slate-400" />
            <span>Calibrated against {activeCabin.label} historical fares</span>
          </div>
        </div>
      </div>

      {/* 6. Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        flight={flight}
        currency={currency}
        cabinMultiplier={cabinMultiplier}
        existingTargetPrice={targetPriceUSD}
        onSaveAlert={(targetUSD, email) => {
          onSaveAlert?.(targetUSD, email);
          setIsAlertModalOpen(false);
        }}
        onRemoveAlert={() => {
          onRemoveAlert?.();
          setIsAlertModalOpen(false);
        }}
      />
    </div>
  );
}
