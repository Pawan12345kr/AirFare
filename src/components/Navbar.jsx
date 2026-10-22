import { useEffect, useRef, useState } from 'react';
import { Plane, Bookmark, ChevronDown, Check, Activity, ShieldCheck, Key } from 'lucide-react';
import { CURRENCIES } from '../lib/currency.js';

function CurrencySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const current = CURRENCIES[value] ?? CURRENCIES.USD;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
      >
        <span className="text-slate-400">{current.symbol}</span>
        {current.code}
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="animate-fade-up absolute right-0 z-30 mt-1.5 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg shadow-slate-900/5"
        >
          {Object.values(CURRENCIES).map((c) => (
            <li key={c.code}>
              <button
                type="button"
                role="option"
                aria-selected={c.code === value}
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-xs font-semibold text-slate-600">
                  {c.symbol}
                </span>
                <span className="flex-1">
                  <span className="font-medium text-slate-900">{c.code}</span>
                  <span className="ml-1.5 text-slate-400">{c.label}</span>
                </span>
                {c.code === value && <Check className="h-4 w-4 text-indigo-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DataSourcePill({ mode, onToggleMode, apiStatus, activeSourceMessage }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const isLive = mode === 'live';
  const hasLiveKeys = apiStatus?.serpapiConfigured || apiStatus?.amadeusConfigured;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle Data Source Mode"
        className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none"
      >
        <span
          className={`h-2 w-2 rounded-full ${
            !isLive
              ? 'bg-slate-400'
              : hasLiveKeys
              ? 'bg-emerald-500 animate-pulse'
              : 'bg-amber-500'
          }`}
        />
        <span className="hidden sm:inline text-slate-400 font-normal">Source:</span>
        <span className="font-semibold text-slate-800">
          {isLive ? (hasLiveKeys ? 'Live API' : 'Live API (Sandbox Fallback)') : 'Demo Sandbox'}
        </span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="animate-fade-up absolute right-0 z-40 mt-1.5 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10">
          {/* Header & Mode Switcher */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">Flight Data Source</p>
              <p className="text-[11px] text-slate-500">Live API or Offline Sandbox</p>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onToggleMode('live')}
                className={`px-2 py-1 rounded-md transition-all ${
                  isLive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live API
              </button>
              <button
                type="button"
                onClick={() => onToggleMode('sandbox')}
                className={`px-2 py-1 rounded-md transition-all ${
                  !isLive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sandbox
              </button>
            </div>
          </div>

          {/* Credentials Status */}
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">SerpApi (Google Flights)</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  apiStatus?.serpapiConfigured ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {apiStatus?.serpapiConfigured ? 'Active & Ready' : 'Key Not Set'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Amadeus Aviation API</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  apiStatus?.amadeusConfigured ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {apiStatus?.amadeusConfigured ? 'Active & Ready' : 'Key Not Set'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Server 15m TTL Cache</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded ring-1 ring-emerald-600/20">
                Rate-Limit Shield Active
              </span>
            </div>
          </div>

          {/* Helper note */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            {hasLiveKeys ? (
              <span className="text-emerald-700 font-medium">
                Connected to live pricing proxy. Requests are cached for 15 minutes to preserve quota.
              </span>
            ) : (
              <span>
                To connect live OTA prices, paste your <code className="font-mono text-slate-700 bg-slate-100 px-1 rounded">SERPAPI_KEY</code> or <code className="font-mono text-slate-700 bg-slate-100 px-1 rounded">AMADEUS</code> keys into <code className="font-mono text-slate-700 bg-slate-100 px-1 rounded">.env.local</code>. Automatic fallback protects against errors.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar({
  trackedCount,
  currency,
  onCurrencyChange,
  onOpenWatchlist,
  dataSourceMode = 'live',
  onToggleDataSourceMode,
  apiStatus = null,
  activeSourceMessage = '',
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2" aria-label="AirFare home">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <Plane className="h-4 w-4 -rotate-45" strokeWidth={2.25} />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-slate-900">AirFare</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Data Source Pill */}
          <DataSourcePill
            mode={dataSourceMode}
            onToggleMode={onToggleDataSourceMode}
            apiStatus={apiStatus}
            activeSourceMessage={activeSourceMessage}
          />

          {/* Tracked Flights Watchlist Button */}
          <button
            type="button"
            onClick={onOpenWatchlist}
            aria-label="Open tracked flights watchlist drawer"
            className="flex h-8 items-center gap-2 rounded-md px-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Tracked</span>
            <span
              className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums transition-colors ${
                trackedCount > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {trackedCount}
            </span>
          </button>

          <div className="h-5 w-px bg-slate-200" />
          <CurrencySelect value={currency} onChange={onCurrencyChange} />
        </div>
      </div>
    </header>
  );
}
