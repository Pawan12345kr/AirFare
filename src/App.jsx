import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Info, Plane, SearchX } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import SearchBar from './components/SearchBar.jsx';
import FlightList, { FlightListSkeleton } from './components/FlightList.jsx';
import AnalyticsPanel, { AnalyticsPanelSkeleton } from './components/AnalyticsPanel.jsx';
import WatchlistDrawer from './components/WatchlistDrawer.jsx';
import { toISODate } from './data/mockEngine.js';
import { searchFlights, checkServerApiStatus } from './services/flightApi.js';
import { AIRPORT_BY_CODE } from './data/airports.js';
import { formatPrice } from './lib/currency.js';

const POPULAR_ROUTES = [
  ['DEL', 'BOM'],
  ['BLR', 'DEL'],
  ['DEL', 'GOI'],
  ['BOM', 'DXB'],
  ['DEL', 'LHR'],
  ['BOM', 'SIN'],
  ['DEL', 'BKK'],
  ['JFK', 'LHR'],
  ['DEL', 'SXR'],
];

const SORTS = {
  departure: { label: 'Departure', fn: (a, b) => a.departureMinutes - b.departureMinutes },
  price: { label: 'Cheapest', fn: (a, b) => a.currentPrice - b.currentPrice },
  duration: { label: 'Fastest', fn: (a, b) => a.durationMinutes - b.durationMinutes },
};

function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return toISODate(d);
}

const formatLongDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

export default function App() {
  const [currency, setCurrency] = usePersistentState('airfare:currency', 'INR');
  const [tracked, setTracked] = usePersistentState('airfare:tracked', {});
  const [dataSourceMode, setDataSourceMode] = usePersistentState('airfare:dataSourceMode', 'live');
  const [apiStatus, setApiStatus] = useState(null);
  const [searchMeta, setSearchMeta] = useState(null);
  const [query, setQuery] = useState(null);
  const [formSeed, setFormSeed] = useState({ key: 0, origin: 'DEL', destination: 'BOM', date: defaultDate(), filter: '' });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('departure');
  const [selectedId, setSelectedId] = useState(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSwitchingFlight, setIsSwitchingFlight] = useState(false);
  const searchToken = useRef(0);
  const panelRef = useRef(null);
  const switchTimerRef = useRef(null);

  // Check server API status on mount
  useEffect(() => {
    checkServerApiStatus().then(setApiStatus).catch(() => {});
  }, []);

  const trackedIds = useMemo(() => new Set(Object.keys(tracked)), [tracked]);

  const runSearch = useCallback(
    async (params) => {
      const token = ++searchToken.current;
      setLoading(true);
      setQuery(params);

      try {
        const result = await searchFlights({
          ...params,
          currency,
          mode: dataSourceMode,
        });

        if (token !== searchToken.current) return;
        setFlights(result.flights);
        setSearchMeta(result.meta);
        // Auto-select the first card in the current sort order.
        setSelectedId([...result.flights].sort(SORTS[sort].fn)[0]?.id ?? null);
      } catch (err) {
        console.error('[Search Error]:', err);
      } finally {
        if (token === searchToken.current) {
          setLoading(false);
        }
      }
    },
    [sort, currency, dataSourceMode],
  );

  const handleToggleDataSourceMode = useCallback(
    (newMode) => {
      setDataSourceMode(newMode);
      if (query) {
        runSearch({ ...query });
      }
    },
    [query, runSearch, setDataSourceMode],
  );

  const searchPopular = (origin, destination) => {
    const params = { origin, destination, date: formSeed.date, filter: '' };
    setFormSeed((s) => ({ ...params, key: s.key + 1 }));
    runSearch(params);
  };

  // Load the default route on first render so the workspace is never empty.
  useEffect(() => {
    runSearch({ origin: formSeed.origin, destination: formSeed.destination, date: formSeed.date, filter: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTrack = useCallback(
    (flight) =>
      setTracked((t) => {
        const next = { ...t };
        if (next[flight.id]) {
          delete next[flight.id];
        } else {
          next[flight.id] = {
            id: flight.id,
            flightNumber: flight.flightNumber,
            airline: flight.airline,
            origin: flight.origin,
            destination: flight.destination,
            date: flight.date,
            aircraft: flight.aircraft,
            currentPrice: flight.currentPrice,
            targetPrice: Math.round(flight.currentPrice * 0.9), // Suggested 10% drop target
            createdAt: Date.now(),
          };
        }
        return next;
      }),
    [setTracked],
  );

  const handleSaveAlert = useCallback(
    (flight, targetUSD, email) => {
      if (!flight) return;
      const userEmail = email || (typeof localStorage !== 'undefined' ? localStorage.getItem('airfare:user_email') : '') || 'traveler@example.com';
      setTracked((t) => ({
        ...t,
        [flight.id]: {
          ...(t[flight.id] ?? {
            id: flight.id,
            flightNumber: flight.flightNumber,
            airline: flight.airline,
            origin: flight.origin,
            destination: flight.destination,
            date: flight.date,
            aircraft: flight.aircraft,
            currentPrice: flight.currentPrice,
            createdAt: Date.now(),
          }),
          targetPrice: targetUSD,
          email: userEmail,
          updatedAt: Date.now(),
        },
      }));
    },
    [setTracked],
  );

  const handleRemoveAlert = useCallback(
    (flightId) => {
      if (!flightId) return;
      setTracked((t) => {
        if (!t[flightId]) return t;
        const next = { ...t };
        delete next[flightId].targetPrice;
        return next;
      });
    },
    [setTracked],
  );

  const handleRemoveFromWatchlist = useCallback(
    (flightId) => {
      setTracked((t) => {
        const next = { ...t };
        delete next[flightId];
        return next;
      });
    },
    [setTracked],
  );

  const handleClearWatchlist = useCallback(() => {
    setTracked({});
  }, [setTracked]);

  const sorted = useMemo(() => [...flights].sort(SORTS[sort].fn), [flights, sort]);
  const cheapest = flights.length ? Math.min(...flights.map((f) => f.currentPrice)) : null;
  const selectedFlight = useMemo(() => flights.find((f) => f.id === selectedId) ?? null, [flights, selectedId]);

  // Smooth 0.4s skeleton transition when switching flights
  const selectFlight = useCallback(
    (id) => {
      if (id === selectedId) return;
      setIsSwitchingFlight(true);
      setSelectedId(id);
      clearTimeout(switchTimerRef.current);
      switchTimerRef.current = setTimeout(() => {
        setIsSwitchingFlight(false);
      }, 380);

      // On desktop, smoothly reset the right panel's scroll to top so the newly selected flight is viewed from its header
      if (panelRef.current) {
        panelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // On stacked (mobile) layouts the analytics panel sits above the list — bring it into view.
      if (window.matchMedia('(max-width: 1023px)').matches) {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [selectedId],
  );

  const handleJumpToTrackedFlight = useCallback(
    (item) => {
      setIsWatchlistOpen(false);
      const isSameRoute =
        query?.origin === item.origin &&
        query?.destination === item.destination &&
        query?.date === item.date;

      if (isSameRoute) {
        selectFlight(item.id);
      } else {
        const newParams = {
          origin: item.origin,
          destination: item.destination,
          date: item.date,
          filter: item.flightNumber,
        };
        setFormSeed((s) => ({ ...newParams, key: s.key + 1 }));
        runSearch(newParams);
      }

      setTimeout(() => {
        if (panelRef.current) {
          panelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (window.matchMedia('(max-width: 1023px)').matches) {
          panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    },
    [query, runSearch, selectFlight],
  );

  return (
    <div className="min-h-screen">
      <Navbar
        trackedCount={trackedIds.size}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        dataSourceMode={dataSourceMode}
        onToggleDataSourceMode={handleToggleDataSourceMode}
        apiStatus={apiStatus}
        activeSourceMessage={searchMeta?.sourceMessage ?? ''}
      />

      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {/* Hero */}
        <section className="pb-8 pt-12 sm:pt-16">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live fare intelligence · 30-day history
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Know when to book.
            </h1>
            <p className="mt-2.5 text-[15px] text-slate-500">
              Track any flight and see exactly how its fare has moved, so you buy at the right moment.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <SearchBar key={formSeed.key} initial={formSeed} onSearch={runSearch} loading={loading} />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="mr-1 text-slate-400">Popular</span>
              {POPULAR_ROUTES.map(([o, d]) => {
                const active = query?.origin === o && query?.destination === d;
                return (
                  <button
                    key={`${o}-${d}`}
                    type="button"
                    onClick={() => searchPopular(o, d)}
                    className={`group inline-flex items-center gap-1 rounded-md border px-2 py-1 font-medium tabular-nums transition-colors ${
                      active
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {o}
                    <ArrowRight className="h-3 w-3 opacity-50" />
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Workspace */}
        <section>
          {query && (
            <>
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900">
                    <span className="tabular-nums">{query.origin}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <span className="tabular-nums">{query.destination}</span>
                    <span className="font-normal text-slate-400">
                      · {AIRPORT_BY_CODE[query.origin].city} to {AIRPORT_BY_CODE[query.destination].city}
                    </span>
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="text-sm text-slate-500">
                      {formatLongDate(query.date)}
                      {!loading && flights.length > 0 && (
                        <>
                          {' · '}
                          <span className="tabular-nums">{flights.length}</span> flights · from{' '}
                          <span className="font-medium tabular-nums text-slate-900">{formatPrice(cheapest, currency)}</span>
                        </>
                      )}
                      {query.filter && (
                        <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">“{query.filter}”</span>
                      )}
                    </p>

                    {searchMeta && !loading && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            searchMeta.source === 'live_google_flights'
                              ? 'bg-emerald-500 animate-pulse'
                              : searchMeta.source === 'demo_fallback'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span>{searchMeta.sourceMessage}</span>
                        {searchMeta.cached && (
                          <span className="text-emerald-700 font-semibold">· ⚡ 15m Cache</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-6 lg:grid-cols-5">
                  <div className="lg:col-span-2 lg:h-[calc(100vh-5rem)] lg:overflow-hidden">
                    <FlightListSkeleton />
                  </div>
                  <div className="hidden lg:col-span-3 lg:block lg:h-[calc(100vh-5rem)] lg:overflow-hidden">
                    <AnalyticsPanelSkeleton />
                  </div>
                </div>
              ) : flights.length ? (
                <div className="grid items-start gap-6 lg:grid-cols-5">
                  {/* Left: flight list (40%) — independently scrollable */}
                  <div className="lg:col-span-2 lg:sticky lg:top-16 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1.5 custom-scrollbar">
                    <div className="sticky top-0 z-10 mb-3 flex items-center justify-between gap-3 bg-slate-50/95 pb-2 pt-0.5 backdrop-blur-sm">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        <span className="tabular-nums">{flights.length}</span> {flights.length === 1 ? 'flight' : 'flights'}
                      </p>
                      {flights.length > 1 && (
                        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs">
                          {Object.entries(SORTS).map(([k, s]) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setSort(k)}
                              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                                sort === k ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <FlightList
                      flights={sorted}
                      currency={currency}
                      selectedId={selectedId}
                      trackedIds={trackedIds}
                      onSelect={selectFlight}
                      onToggleTrack={toggleTrack}
                    />
                    <p className="mt-3 flex items-start gap-1.5 pb-4 text-xs text-slate-400">
                      <Info className="mt-px h-3.5 w-3.5 shrink-0" />
                      Fares are simulated. Badges compare today’s fare with its 30-day average (±5%).
                    </p>
                  </div>

                  {/* Right: analytics dashboard (60%) — independently scrollable */}
                  <div
                    ref={panelRef}
                    className="order-first scroll-mt-20 lg:order-none lg:sticky lg:top-16 lg:col-span-3 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1.5 custom-scrollbar"
                  >
                    {isSwitchingFlight ? (
                      <AnalyticsPanelSkeleton />
                    ) : (
                      <AnalyticsPanel
                        flight={selectedFlight}
                        currency={currency}
                        targetPriceUSD={tracked[selectedFlight?.id]?.targetPrice ?? null}
                        onSaveAlert={(targetUSD, email) => handleSaveAlert(selectedFlight, targetUSD, email)}
                        onRemoveAlert={() => handleRemoveAlert(selectedFlight?.id)}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
                  <SearchX className="mx-auto h-6 w-6 text-slate-400" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">No flights match “{query.filter}”</h3>
                  <p className="mt-1 text-sm text-slate-500">Try a different airline or clear the flight filter.</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Watchlist Slide-out Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={tracked}
        currency={currency}
        onSelectFlight={handleJumpToTrackedFlight}
        onRemoveFlight={handleRemoveFromWatchlist}
        onClearAll={handleClearWatchlist}
      />
    </div>
  );
}
