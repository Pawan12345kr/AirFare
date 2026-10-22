import { useEffect, useId, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { AIRPORT_BY_CODE, searchAirports } from '../data/airports.js';

/**
 * Airport autocomplete. Matches IATA code, city or airport name with keyboard navigation.
 */
export default function AirportInput({ label, icon: Icon = MapPin, value, onChange, exclude, placeholder, autoFocus, error }) {
  const listId = useId();
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selected = value ? AIRPORT_BY_CODE[value] : null;
  const results = searchAirports(query, { exclude });

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => setActive(0), [query]);

  const select = (airport) => {
    onChange(airport.code);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      select(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
      inputRef.current?.blur();
    } else if (e.key === 'Tab' && open && query && results[active]) {
      select(results[active]);
    }
  };

  return (
    <div ref={wrapRef} className="relative min-w-0 flex-1">
      <label
        onClick={() => inputRef.current?.focus()}
        className={`group flex h-full cursor-text flex-col justify-center rounded-xl px-4 py-2.5 transition-colors hover:bg-slate-50 ${
          open ? 'bg-slate-50' : ''
        }`}
      >
        <span className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider ${error ? 'text-rose-500' : 'text-slate-400'}`}>
          <Icon className="h-3 w-3" />
          {label}
        </span>
        <span className="mt-0.5 flex items-baseline gap-2">
          {selected && !open && (
            <span className="text-base font-semibold tabular-nums tracking-tight text-slate-900">{selected.code}</span>
          )}
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            autoFocus={autoFocus}
            value={open ? query : selected?.city ?? ''}
            placeholder={open ? 'City or airport code' : placeholder}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            className={`w-full min-w-0 truncate bg-transparent text-sm outline-none placeholder:text-slate-400 ${
              selected && !open ? 'text-slate-500' : 'text-base font-medium text-slate-900'
            }`}
          />
        </span>
      </label>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="animate-fade-up absolute left-0 top-full z-30 mt-2 max-h-80 w-full min-w-[300px] overflow-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
        >
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-slate-400">No airports match “{query}”</li>
          ) : (
            results.map((a, i) => (
              <li key={a.code} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(a)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                    i === active ? 'bg-slate-100' : ''
                  }`}
                >
                  <span
                    className={`flex h-8 w-11 shrink-0 items-center justify-center rounded-md text-xs font-semibold tabular-nums tracking-wide ${
                      i === active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {a.code}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">{a.city}</span>
                    <span className="block truncate text-xs text-slate-500">{a.name}</span>
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">{a.countryName || a.country}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
