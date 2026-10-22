import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BellRing,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  Mail,
  Send,
  Sliders,
  Sparkles,
  Target,
  TrendingDown,
  X,
} from 'lucide-react';
import { AirlineMark } from './FlightCard.jsx';
import { formatPrice } from '../lib/currency.js';
import { sendFlightNotificationEmail } from '../services/flightApi.js';

export default function PriceAlertModal({
  isOpen,
  onClose,
  flight,
  currency,
  cabinMultiplier = 1,
  existingTargetPrice,
  onSaveAlert,
  onRemoveAlert,
}) {
  const currentPrice = useMemo(() => {
    return Math.round((flight?.currentPrice ?? 100) * cabinMultiplier);
  }, [flight, cabinMultiplier]);

  // Default target price: 10% below current price or existing saved target
  const defaultTarget = useMemo(() => {
    if (existingTargetPrice != null) return existingTargetPrice;
    return Math.round(currentPrice * 0.9);
  }, [existingTargetPrice, currentPrice]);

  const [targetPrice, setTargetPrice] = useState(defaultTarget);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('airfare:user_email') || 'traveler@example.com';
    } catch {
      return 'traveler@example.com';
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync when flight or modal opens
  useEffect(() => {
    if (isOpen) {
      setTargetPrice(defaultTarget);
      setSavedSuccess(false);
      setEmailFeedback(null);
      try {
        const saved = localStorage.getItem('airfare:user_email');
        if (saved) setEmail(saved);
      } catch {}
    }
  }, [isOpen, defaultTarget]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !flight) return null;

  const minSlider = Math.max(20, Math.round(currentPrice * 0.5));
  const maxSlider = Math.round(currentPrice * 1.05);
  const diffFromCurrent = targetPrice - currentPrice;
  const diffPct = ((targetPrice - currentPrice) / currentPrice) * 100;
  const savings = Math.max(0, currentPrice - targetPrice);

  const presets = [
    { label: '-5%', price: Math.round(currentPrice * 0.95) },
    { label: '-10% (Recommended)', price: Math.round(currentPrice * 0.9) },
    { label: '-15%', price: Math.round(currentPrice * 0.85) },
    {
      label: `60d Low (${formatPrice(Math.round(flight.stats.min * cabinMultiplier), currency)})`,
      price: Math.round(flight.stats.min * cabinMultiplier),
    },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSavedSuccess(true);

    try {
      localStorage.setItem('airfare:user_email', email.trim());
    } catch {}

    // 1. Save alert to Watchlist in browser state
    onSaveAlert(targetPrice, email.trim());

    // 2. Dispatch real notification email if alerts enabled
    if (emailAlerts && email.trim()) {
      try {
        const res = await sendFlightNotificationEmail({
          recipient: email.trim(),
          type: 'track_confirmation',
          flight,
          targetPrice,
          currentPrice,
          currency,
        });
        setEmailFeedback(res);
      } catch (err) {
        console.warn('Failed to dispatch alert email:', err);
      }
    }

    setIsSubmitting(false);

    // Auto-dismiss after 1.8s so user can read the confirmation
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-modal-title"
        className="animate-fade-up relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h3 id="alert-modal-title" className="text-base font-bold text-slate-900">
                Set Price Drop Alert &amp; Email
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Track <span className="font-semibold text-slate-700">{flight.flightNumber}</span> ({flight.origin} → {flight.destination})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5">
          {/* Flight Summary Card */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-100">
            <div className="flex items-center gap-3">
              <AirlineMark airline={flight.airline} size="md" />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {flight.airline.name} <span className="text-slate-400">· {flight.flightNumber}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {flight.origin} to {flight.destination} · {flight.date}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Current Fare</span>
              <p className="text-base font-bold tabular-nums text-slate-900">
                {formatPrice(currentPrice, currency)}
              </p>
            </div>
          </div>

          {/* Target Price Control Section */}
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="target-price-slider" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-emerald-600" />
                Target Price
              </label>

              <div className="text-right">
                <span className="text-2xl font-bold tabular-nums tracking-tight text-emerald-600">
                  {formatPrice(targetPrice, currency)}
                </span>
                <span
                  className={`ml-2 inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums ${
                    diffPct < 0
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {diffPct <= 0 ? `${diffPct.toFixed(0)}%` : `+${diffPct.toFixed(0)}%`}
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="mt-3">
              <input
                id="target-price-slider"
                type="range"
                min={minSlider}
                max={maxSlider}
                step={Math.max(1, Math.round(currentPrice * 0.01))}
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-600"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-400 tabular-nums">
                <span>Min: {formatPrice(minSlider, currency)} (-50%)</span>
                <span>Current: {formatPrice(currentPrice, currency)}</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTargetPrice(preset.price)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors ${
                    targetPrice === preset.price
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {savings > 0 && (
              <p className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                You will save approx. {formatPrice(savings, currency)} when this price drops.
              </p>
            )}
          </div>

          {/* Email Alert Preference */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-indigo-600" />
                Send Instant Email Notifications
              </span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            {emailAlerts && (
              <div className="animate-fade-up space-y-1.5">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span>🔔 Alerts are dispatched the second fares drop below your target price.</span>
                </p>
              </div>
            )}
          </div>

          {/* Email Feedback Banner */}
          {savedSuccess && (
            <div className="animate-fade-up rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Tracking activated &amp; notification sent!</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Confirmation email dispatched to <strong>{email}</strong>.
                  </p>
                  {emailFeedback?.previewUrl && (
                    <a
                      href={emailFeedback.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 underline hover:text-indigo-900"
                    >
                      <span>Preview Rendered Email (Ethereal Inbox)</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            {existingTargetPrice != null ? (
              <button
                type="button"
                onClick={() => {
                  onRemoveAlert();
                  onClose();
                }}
                className="text-xs font-medium text-rose-600 hover:text-rose-700"
              >
                Remove Alert
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || savedSuccess}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Alert...
                  </>
                ) : savedSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Save Target &amp; Enable Email
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
