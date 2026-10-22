import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bell,
  BellRing,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  Send,
  Target,
  Trash2,
  TrendingDown,
  X,
} from 'lucide-react';
import { AirlineMark } from './FlightCard.jsx';
import { formatPrice } from '../lib/currency.js';
import { sendFlightNotificationEmail } from '../services/flightApi.js';

export default function WatchlistDrawer({
  isOpen,
  onClose,
  watchlist,
  currency,
  onSelectFlight,
  onRemoveFlight,
  onClearAll,
}) {
  const items = Object.values(watchlist ?? {});
  const [sendingId, setSendingId] = useState(null);
  const [emailStatus, setEmailStatus] = useState({});
  const [globalEmail, setGlobalEmail] = useState(() => {
    try {
      return localStorage.getItem('airfare:user_email') || 'traveler@example.com';
    } catch {
      return 'traveler@example.com';
    }
  });
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      try {
        const saved = localStorage.getItem('airfare:user_email');
        if (saved) setGlobalEmail(saved);
      } catch {}
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSaveEmail = (newEmail) => {
    setGlobalEmail(newEmail);
    try {
      localStorage.setItem('airfare:user_email', newEmail);
    } catch {}
    setIsEditingEmail(false);
  };

  const handleSendTestNotification = async (item) => {
    setSendingId(item.id);
    const targetEmail = item.email || globalEmail || 'traveler@example.com';

    try {
      const res = await sendFlightNotificationEmail({
        recipient: targetEmail,
        type: 'price_drop',
        flight: item,
        targetPrice: item.targetPrice || item.currentPrice,
        currentPrice: item.currentPrice,
        currency,
      });

      setEmailStatus((prev) => ({
        ...prev,
        [item.id]: {
          success: true,
          recipient: targetEmail,
          previewUrl: res.previewUrl,
        },
      }));
    } catch (err) {
      console.warn('Failed to send test alert:', err);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tracked flights watchlist"
          className={`w-screen max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Bookmark className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Tracked Flights &amp; Watchlist</h2>
                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-700 tabular-nums">{items.length}</span> {items.length === 1 ? 'flight' : 'flights'} monitored · 24/7 Alerts
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close watchlist drawer"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Email Notification Channel Bar */}
          <div className="border-b border-slate-100 bg-indigo-50/50 px-5 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-indigo-900">
              <Mail className="h-3.5 w-3.5 text-indigo-600" />
              <span>Email alerts sent to:</span>
              {isEditingEmail ? (
                <input
                  type="email"
                  autoFocus
                  defaultValue={globalEmail}
                  onBlur={(e) => handleSaveEmail(e.target.value.trim() || globalEmail)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEmail(e.target.value.trim() || globalEmail);
                  }}
                  className="rounded border border-indigo-300 bg-white px-2 py-0.5 text-xs text-slate-800 outline-none"
                />
              ) : (
                <strong className="text-indigo-950 font-semibold">{globalEmail}</strong>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsEditingEmail((v) => !v)}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
            >
              {isEditingEmail ? 'Save' : 'Change'}
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Bookmark className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">Your watchlist is empty</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-xs">
                  Click the "Track" button on any flight card or "Track Fare / Set Alert" in the analytics panel to receive price drop notifications.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => {
                  const current = item.currentPrice;
                  const target = item.targetPrice;
                  const hasTarget = target != null;
                  const targetReached = hasTarget && current <= target;
                  const diff = hasTarget ? current - target : 0;
                  const diffPct = hasTarget && target > 0 ? ((current - target) / target) * 100 : 0;
                  const itemEmail = item.email || globalEmail;
                  const status = emailStatus[item.id];

                  return (
                    <li
                      key={item.id}
                      className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                    >
                      {/* Top row: Airline & Flight Info */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {item.airline && <AirlineMark airline={item.airline} size="md" />}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-sm text-slate-900">
                                {item.airline?.name ?? item.flightNumber}
                              </span>
                              <span className="rounded bg-slate-100 px-1.5 py-px text-[10px] font-semibold tabular-nums text-slate-600">
                                {item.flightNumber}
                              </span>
                            </div>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                              <span className="font-medium tabular-nums">{item.origin}</span>
                              <ArrowRight className="h-3 w-3 text-slate-400" />
                              <span className="font-medium tabular-nums">{item.destination}</span>
                              <span className="text-slate-300">·</span>
                              <CalendarDays className="h-3 w-3 text-slate-400" />
                              <span>{item.date}</span>
                            </p>
                          </div>
                        </div>

                        {/* Remove Action */}
                        <button
                          type="button"
                          onClick={() => onRemoveFlight(item.id)}
                          aria-label={`Remove ${item.flightNumber} from watchlist`}
                          className="rounded p-1 text-slate-300 hover:bg-slate-100 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Middle row: Price Comparison */}
                      <div className="mt-3.5 flex items-baseline justify-between border-t border-slate-100 pt-3">
                        <div>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Current Fare</span>
                          <p className="text-lg font-bold tabular-nums text-slate-900">
                            {formatPrice(current, currency)}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center justify-end gap-1">
                            <Target className="h-3 w-3 text-emerald-600" />
                            Target Price
                          </span>
                          <p className={`text-base font-bold tabular-nums ${hasTarget ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {hasTarget ? formatPrice(target, currency) : 'No alert set'}
                          </p>
                        </div>
                      </div>

                      {/* Target status badge */}
                      {hasTarget && (
                        <div className="mt-2.5">
                          {targetReached ? (
                            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Target price reached! Great time to book.</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-100">
                              <TrendingDown className="h-3 w-3 text-amber-500" />
                              <span>
                                Needs drop of <span className="font-semibold text-slate-900">{formatPrice(diff, currency)}</span> (-{diffPct.toFixed(0)}%)
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Email Notification Status & Action */}
                      <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/80 p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Bell className="h-3 w-3 text-indigo-600" />
                            <span>Alerts: <strong>{itemEmail}</strong></span>
                          </span>

                          <button
                            type="button"
                            disabled={sendingId === item.id}
                            onClick={() => handleSendTestNotification(item)}
                            className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors disabled:opacity-50"
                          >
                            {sendingId === item.id ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-2.5 w-2.5" />
                                <span>Send Alert Email</span>
                              </>
                            )}
                          </button>
                        </div>

                        {status?.success && (
                          <div className="text-[11px] text-emerald-700 flex items-center justify-between pt-1 border-t border-slate-200/60">
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span>Email sent to {status.recipient}!</span>
                            </span>
                            {status.previewUrl && (
                              <a
                                href={status.previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold underline text-indigo-600 hover:text-indigo-800"
                              >
                                View Email ↗
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Jump to Graph Action */}
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectFlight(item);
                            onClose();
                          }}
                          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-colors"
                        >
                          <span>View Analytics &amp; Graph</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Persisted to browser storage
                </span>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
