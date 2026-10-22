import { memo } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import Sparkline from './Sparkline.jsx';
import { formatPrice } from '../lib/currency.js';
import { getPriceLevel } from '../lib/pricing.js';

export function AirlineMark({ airline, size = 'md' }) {
  const dims = size === 'lg' ? 'h-11 w-11 text-xs rounded-xl' : 'h-9 w-9 text-[11px] rounded-lg';
  return (
    <span
      className={`flex shrink-0 items-center justify-center font-bold tracking-tight text-white shadow-sm ${dims}`}
      style={{ backgroundColor: airline.color }}
      aria-hidden="true"
    >
      {airline.code}
    </span>
  );
}

export function PriceLevelPill({ flight, className = '' }) {
  const level = getPriceLevel(flight);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${level.pill} ${className}`}
      title={`${level.deltaPct >= 0 ? '+' : ''}${level.deltaPct.toFixed(1)}% vs 30-day average`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${level.dot}`} />
      {level.label}
    </span>
  );
}

export function RouteTimeline({ flight, compact = false }) {
  const time = compact ? 'text-[15px]' : 'text-lg';
  return (
    <div className="flex items-center gap-3">
      <div>
        <p className={`${time} font-semibold leading-tight tabular-nums tracking-tight text-slate-900`}>{flight.departureTime}</p>
        <p className="text-[11px] font-medium tabular-nums text-slate-400">{flight.origin}</p>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center">
        <p className="text-[11px] tabular-nums text-slate-500">{flight.duration}</p>
        <div className="relative my-1 h-px w-full bg-slate-200">
          <span className="absolute -left-0.5 -top-[3px] h-[7px] w-[7px] rounded-full border border-slate-300 bg-white" />
          {flight.stops > 0 && (
            <span className="absolute left-1/2 -top-[3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-amber-400 ring-2 ring-white" />
          )}
          <span className="absolute -right-0.5 -top-[3px] h-[7px] w-[7px] rounded-full bg-slate-400" />
        </div>
        <p className={`text-[11px] ${flight.stops ? 'text-amber-600' : 'text-emerald-600'}`}>
          {flight.stops ? (
            <>
              1 stop <span className="tabular-nums text-slate-400">· {flight.via}</span>
            </>
          ) : (
            'Non-stop'
          )}
        </p>
      </div>

      <div className="text-right">
        <p className={`${time} font-semibold leading-tight tabular-nums tracking-tight text-slate-900`}>
          {flight.arrivalTime}
          {flight.arrivalDayOffset > 0 && (
            <sup className="ml-0.5 text-[10px] font-medium text-rose-500">+{flight.arrivalDayOffset}</sup>
          )}
        </p>
        <p className="text-[11px] font-medium tabular-nums text-slate-400">{flight.destination}</p>
      </div>
    </div>
  );
}

function FlightCard({ flight, currency, selected, tracked, onSelect, onToggleTrack, index }) {
  return (
    <li className="animate-fade-up relative" style={{ animationDelay: `${index * 40}ms` }}>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        onClick={() => onSelect(flight.id)}
        className={`block w-full rounded-xl border bg-white p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
          selected
            ? 'border-indigo-600 shadow-[0_0_0_1px_rgb(79,70,229),0_8px_24px_-12px_rgba(79,70,229,0.35)]'
            : 'border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:shadow-[0_4px_12px_-6px_rgba(15,23,42,0.12)]'
        }`}
      >
        {/* Airline + price */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <AirlineMark airline={flight.airline} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{flight.airline.name}</p>
              <span
                className={`mt-0.5 inline-block rounded px-1.5 py-px text-[11px] font-medium tabular-nums ${
                  selected ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {flight.flightNumber}
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xl font-bold leading-tight tabular-nums tracking-tight text-slate-900">
              {formatPrice(flight.currentPrice, currency)}
            </p>
            <PriceLevelPill flight={flight} className="mt-1" />
          </div>
        </div>

        {/* Schedule */}
        <div className="mt-4">
          <RouteTimeline flight={flight} compact />
        </div>

        {/* Sparkline (right side reserved for the Track button overlay) */}
        <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pr-24 pt-3">
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-slate-400">30d</span>
          <div className="h-8 min-w-0 flex-1">
            <Sparkline
              data={flight.history.slice(-30)}
              avg={flight.stats.avg}
              id={flight.id}
              color={selected ? '#4f46e5' : '#94a3b8'}
            />
          </div>
        </div>
      </button>

      {/* Sibling (not nested) so we don't put a button inside a button */}
      <button
        type="button"
        onClick={() => onToggleTrack(flight)}
        aria-pressed={tracked}
        aria-label={tracked ? `Stop tracking ${flight.flightNumber}` : `Track ${flight.flightNumber}`}
        className={`absolute bottom-4 right-4 flex h-7 items-center gap-1 rounded-md border px-2 text-[11px] font-medium transition-colors ${
          tracked
            ? 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
        }`}
      >
        {tracked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        {tracked ? 'Tracking' : 'Track'}
      </button>
    </li>
  );
}

export default memo(FlightCard);
