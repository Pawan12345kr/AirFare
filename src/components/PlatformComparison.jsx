import { memo, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingDown,
} from 'lucide-react';
import { generatePlatformOffers } from '../data/mockEngine.js';
import { formatPrice } from '../lib/currency.js';

function PlatformComparison({
  flight,
  cabinMultiplier = 1,
  cabinClass = 'economy',
  currency,
  onHoverPlatform,
  hoveredPlatform,
}) {
  const [includeTaxes, setIncludeTaxes] = useState(true);

  // Generate deterministic platform offers scaled by cabin class
  const rawOffers = useMemo(() => {
    return generatePlatformOffers(flight, cabinMultiplier, cabinClass);
  }, [flight, cabinMultiplier, cabinClass]);

  // Strictly sort all platform offers in ascending order of price (cheapest on top)
  const sortedOffers = useMemo(() => {
    return [...rawOffers].sort((a, b) => {
      const priceA = includeTaxes ? a.totalPrice : a.baseFare;
      const priceB = includeTaxes ? b.totalPrice : b.baseFare;
      return priceA - priceB;
    });
  }, [rawOffers, includeTaxes]);

  const cheapestOffer = sortedOffers[0];
  const highestOffer = sortedOffers[sortedOffers.length - 1];

  const cheapestPriceUSD = includeTaxes ? cheapestOffer?.totalPrice ?? 0 : cheapestOffer?.baseFare ?? 0;
  const highestPriceUSD = includeTaxes ? highestOffer?.totalPrice ?? 0 : highestOffer?.baseFare ?? 0;
  const maxSavingsUSD = Math.max(0, highestPriceUSD - cheapestPriceUSD);

  return (
    <div className="border-t border-slate-100 p-5 sm:p-6">
      {/* 1. Header with Title & Taxes Toggle Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Compare Booking Platforms (Low to High)
            </h3>
            {maxSavingsUSD > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <Sparkles className="h-3 w-3" />
                Save up to {formatPrice(maxSavingsUSD, currency)} on this flight
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Live quotes from airline direct and verified Online Travel Agencies (OTAs)
          </p>
        </div>

        {/* Toggle switch for Taxes & Convenience Fees */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80">
          <label htmlFor="taxes-toggle" className="text-xs font-medium text-slate-700 cursor-pointer select-none">
            Include Taxes &amp; Fees
          </label>
          <button
            id="taxes-toggle"
            type="button"
            role="switch"
            aria-checked={includeTaxes}
            onClick={() => setIncludeTaxes((v) => !v)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
              includeTaxes ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                includeTaxes ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Platform Comparison List */}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 divide-y divide-slate-100 bg-white shadow-sm">
        {sortedOffers.map((offer, index) => {
          const rank = index + 1;
          const isCheapest = rank === 1;
          const activePriceUSD = includeTaxes ? offer.totalPrice : offer.baseFare;
          const diffVsLowestUSD = activePriceUSD - cheapestPriceUSD;
          const isHovered = hoveredPlatform?.name === offer.platformName;

          return (
            <div
              key={offer.id}
              onMouseEnter={() =>
                onHoverPlatform?.({
                  name: offer.platformName,
                  priceUSD: activePriceUSD,
                })
              }
              onMouseLeave={() => onHoverPlatform?.(null)}
              className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 transition-all cursor-pointer ${
                isCheapest
                  ? 'border-l-4 border-l-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40'
                  : isHovered
                  ? 'border-l-4 border-l-indigo-500 bg-indigo-50/20'
                  : 'border-l-4 border-l-transparent hover:bg-slate-50/80'
              }`}
            >
              {/* Left Column: Rank, Avatar/Badge, Platform Name, Perks & Promo */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Rank Badge */}
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tabular-nums ${
                    isCheapest
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  #{rank}
                </span>

                {/* Platform Avatar / Logo Badge */}
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: offer.badgeColor }}
                  aria-hidden="true"
                >
                  {offer.logoText}
                </span>

                {/* Platform Name & Perks */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {offer.platformName}
                    </span>

                    {offer.isDirect && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                        <BadgeCheck className="h-3 w-3 text-indigo-600" />
                        Official Airline
                      </span>
                    )}

                    {isCheapest && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                        Cheapest Deal
                      </span>
                    )}
                  </div>

                  {/* Perks & Promo Pills */}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                    {offer.promoCode && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        <Tag className="h-2.5 w-2.5" />
                        {offer.promoCode.code} (-{formatPrice(offer.promoCode.discountUSD, currency)})
                      </span>
                    )}

                    {offer.perks?.slice(0, 2).map((perk, pIdx) => (
                      <span
                        key={pIdx}
                        className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600"
                      >
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Price, Difference vs Lowest, and View Deal Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t border-slate-100 sm:border-t-0">
                <div className="text-left sm:text-right">
                  <p
                    className={`text-lg font-bold tabular-nums tracking-tight ${
                      isCheapest ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {formatPrice(activePriceUSD, currency)}
                  </p>
                  <p className="text-[10px] tabular-nums text-slate-400">
                    {isCheapest ? (
                      <span className="font-semibold text-emerald-600">Lowest available fare</span>
                    ) : (
                      <span>+{formatPrice(diffVsLowestUSD, currency)} vs lowest</span>
                    )}
                  </p>
                </div>

                <a
                  href={offer.bookingUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                    isCheapest
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <span>View Deal</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Hover over any platform row to preview its fare on the main historical graph above.</span>
        <span>Quotes verified 5 mins ago</span>
      </p>
    </div>
  );
}

export default memo(PlatformComparison);
