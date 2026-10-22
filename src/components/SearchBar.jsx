import { useState } from 'react';
import { ArrowLeftRight, CalendarDays, PlaneTakeoff, PlaneLanding, Search, Ticket, X, Loader2 } from 'lucide-react';
import AirportInput from './AirportInput.jsx';
import { toISODate } from '../data/mockEngine.js';

const Divider = () => <div className="mx-1 hidden w-px self-stretch bg-slate-200 lg:my-2 lg:block" />;

function formatDisplayDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return {
    main: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    weekday: date.toLocaleDateString('en-GB', { weekday: 'long' }),
  };
}

export default function SearchBar({ initial, onSearch, loading }) {
  const [origin, setOrigin] = useState(initial.origin);
  const [destination, setDestination] = useState(initial.destination);
  const [date, setDate] = useState(initial.date);
  const [filter, setFilter] = useState(initial.filter ?? '');
  const [swapTurns, setSwapTurns] = useState(0);
  const [errors, setErrors] = useState({});

  const today = toISODate(new Date());
  const display = formatDisplayDate(date);

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
    setSwapTurns((t) => t + 1);
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {
      origin: !origin,
      destination: !destination || destination === origin,
      date: !date || date < today,
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    onSearch({ origin, destination, date, filter: filter.trim() });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-8px_rgba(15,23,42,0.08)] lg:flex-row lg:items-stretch">
        {/* Origin ⇄ Destination */}
        <div className="relative flex flex-col lg:flex-[2.1] lg:flex-row">
          <AirportInput
            label="From"
            icon={PlaneTakeoff}
            value={origin}
            onChange={(c) => {
              setOrigin(c);
              setErrors((x) => ({ ...x, origin: false }));
            }}
            exclude={destination}
            placeholder="Where from?"
            error={errors.origin}
          />
          <div className="relative z-10 flex h-0 items-center justify-end pr-4 lg:h-auto lg:w-0 lg:justify-center lg:pr-0">
            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            >
              <span className="inline-flex rotate-90 lg:rotate-0">
                <ArrowLeftRight
                  className="h-3.5 w-3.5 transition-transform duration-300"
                  style={{ transform: `rotate(${swapTurns * 180}deg)` }}
                />
              </span>
            </button>
          </div>
          <div className="mx-4 h-px bg-slate-100 lg:hidden" />
          <AirportInput
            label="To"
            icon={PlaneLanding}
            value={destination}
            onChange={(c) => {
              setDestination(c);
              setErrors((x) => ({ ...x, destination: false }));
            }}
            exclude={origin}
            placeholder="Where to?"
            error={errors.destination}
          />
        </div>

        <Divider />
        <div className="mx-4 h-px bg-slate-100 lg:hidden" />

        {/* Departure date */}
        <label className="relative flex cursor-pointer flex-col justify-center rounded-xl px-4 py-2.5 transition-colors focus-within:bg-slate-50 hover:bg-slate-50 lg:flex-1">
          <span className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider ${errors.date ? 'text-rose-500' : 'text-slate-400'}`}>
            <CalendarDays className="h-3 w-3" />
            Departure
          </span>
          <span className="mt-0.5 flex items-baseline gap-2 whitespace-nowrap">
            {display ? (
              <>
                <span className="text-base font-semibold tabular-nums tracking-tight text-slate-900">{display.main}</span>
                <span className="truncate text-sm text-slate-500">{display.weekday.slice(0, 3)}</span>
              </>
            ) : (
              <span className="text-base text-slate-400">Select date</span>
            )}
          </span>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => {
              setDate(e.target.value);
              setErrors((x) => ({ ...x, date: false }));
            }}
            onClick={(e) => e.currentTarget.showPicker?.()}
            aria-label="Departure date"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>

        <Divider />
        <div className="mx-4 h-px bg-slate-100 lg:hidden" />

        {/* Airline / flight number */}
        <label className="flex cursor-text flex-col justify-center rounded-xl px-4 py-2.5 transition-colors focus-within:bg-slate-50 hover:bg-slate-50 lg:flex-[1.15]">
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            <Ticket className="h-3 w-3" />
            Airline / Flight <span className="normal-case tracking-normal text-slate-300">· optional</span>
          </span>
          <span className="mt-0.5 flex items-center gap-1">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="e.g. IndiGo or AI-805"
              spellCheck={false}
              autoComplete="off"
              className="w-full min-w-0 bg-transparent text-base font-medium tabular-nums text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter('')}
                aria-label="Clear filter"
                className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1.5 flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 lg:mt-0 lg:ml-1.5 lg:h-auto lg:min-h-14"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" strokeWidth={2.5} />}
          <span className="whitespace-nowrap">Track &amp; Analyze</span>
        </button>
      </div>

      {(errors.origin || errors.destination || errors.date) && (
        <p className="animate-fade-up mt-2.5 px-1 text-sm text-rose-600">
          {errors.destination && origin && destination === origin
            ? 'Origin and destination must be different.'
            : errors.date && date
              ? 'Please choose a departure date from today onwards.'
              : 'Please select an origin, destination and departure date.'}
        </p>
      )}
    </form>
  );
}
