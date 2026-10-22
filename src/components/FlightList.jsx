import { useRef } from 'react';
import FlightCard from './FlightCard.jsx';

export function FlightListSkeleton({ count = 4 }) {
  return (
    <ul className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-100" />
              <div className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-slate-100" />
                <div className="h-3 w-14 rounded bg-slate-100" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-5 w-20 rounded bg-slate-100" />
              <div className="ml-auto h-4 w-16 rounded-full bg-slate-100" />
            </div>
          </div>
          <div className="mt-5 h-3 w-full rounded bg-slate-100" />
          <div className="mt-4 h-8 w-full rounded bg-slate-50" />
        </li>
      ))}
    </ul>
  );
}

/** Vertical list of selectable flight cards. Arrow keys move the selection. */
export default function FlightList({ flights, currency, selectedId, trackedIds, onSelect, onToggleTrack }) {
  const listRef = useRef(null);

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const idx = flights.findIndex((f) => f.id === selectedId);
    const next = e.key === 'ArrowDown' ? Math.min(idx + 1, flights.length - 1) : Math.max(idx - 1, 0);
    if (next === idx) return;
    e.preventDefault();
    onSelect(flights[next].id);
    listRef.current?.querySelectorAll('[role="option"]')[next]?.focus();
  };

  return (
    <ul ref={listRef} role="listbox" aria-label="Flights" onKeyDown={onKeyDown} className="space-y-3">
      {flights.map((f, i) => (
        <FlightCard
          key={f.id}
          flight={f}
          index={i}
          currency={currency}
          selected={f.id === selectedId}
          tracked={trackedIds.has(f.id)}
          onSelect={onSelect}
          onToggleTrack={onToggleTrack}
        />
      ))}
    </ul>
  );
}
