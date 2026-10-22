/** Static FX rates relative to USD (mock data is priced in USD). */
export const CURRENCIES = {
  USD: { code: 'USD', label: 'US Dollar', symbol: '$', rate: 1, locale: 'en-US' },
  EUR: { code: 'EUR', label: 'Euro', symbol: '€', rate: 0.92, locale: 'de-DE' },
  INR: { code: 'INR', label: 'Indian Rupee', symbol: '₹', rate: 84.2, locale: 'en-IN' },
};

const formatters = {};
const compactFormatters = {};

export function convertPrice(usd, currencyCode = 'USD') {
  const c = CURRENCIES[currencyCode] ?? CURRENCIES.USD;
  return Math.round(usd * c.rate);
}

export function formatPrice(usd, currencyCode = 'USD') {
  const c = CURRENCIES[currencyCode] ?? CURRENCIES.USD;
  formatters[c.code] ??= new Intl.NumberFormat(c.locale, {
    style: 'currency',
    currency: c.code,
    maximumFractionDigits: 0,
  });
  return formatters[c.code].format(usd * c.rate);
}

export function formatPriceCompact(usd, currencyCode = 'USD') {
  const c = CURRENCIES[currencyCode] ?? CURRENCIES.USD;
  compactFormatters[c.code] ??= new Intl.NumberFormat(c.locale, {
    style: 'currency',
    currency: c.code,
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  return compactFormatters[c.code].format(usd * c.rate);
}
