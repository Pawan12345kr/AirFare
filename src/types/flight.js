/**
 * @file Strict TypeScript / JSDoc interface definitions for normalized FlightData.
 */

/**
 * @typedef {Object} PlatformOffer
 * @property {string} id - Unique platform identifier (e.g., 'direct', 'makemytrip')
 * @property {string} platformName - Display name of the booking platform
 * @property {string} badgeColor - Hex color code for the platform avatar
 * @property {string} logoText - 2-3 letter initials for the platform avatar
 * @property {boolean} isDirect - True if this is the official airline website
 * @property {number} baseFare - Base flight fare before taxes
 * @property {number} taxesAndFees - Platform convenience fees and government taxes
 * @property {{ code: string, discountUSD: number } | null} [promoCode] - Active promo code if any
 * @property {number} totalPrice - Final payable price (baseFare + taxesAndFees - promoDiscount)
 * @property {string[]} perks - List of perks (e.g., "Free Seat Selection")
 * @property {string} bookingUrl - Outbound booking link
 */

/**
 * @typedef {Object} FlightData
 * @property {string} id - Unique flight identifier (e.g. 'AI-805-2026-11-05')
 * @property {{ code: string, name: string, country: string, color: string }} airline - Airline details
 * @property {string} flightNumber - Flight code (e.g. 'AI-805')
 * @property {string} origin - IATA 3-letter origin code (e.g. 'DEL')
 * @property {string} destination - IATA 3-letter destination code (e.g. 'BOM')
 * @property {string} date - ISO departure date (YYYY-MM-DD)
 * @property {string} departureTime - HH:mm clock time in origin timezone
 * @property {string} arrivalTime - HH:mm clock time in destination timezone
 * @property {number} arrivalDayOffset - +0, +1 for overnight flights
 * @property {number} departureMinutes - Departure minute of the day (0-1439)
 * @property {number} durationMinutes - Total duration in minutes
 * @property {string} duration - Human readable duration (e.g. '2h 5m')
 * @property {number} stops - 0 for nonstop, 1+ for connections
 * @property {string | null} via - IATA layover hub code if any
 * @property {number} layoverMinutes - Layover time in minutes
 * @property {number} distanceKm - Great-circle flight distance in km
 * @property {string} aircraft - Aircraft model (e.g. 'Airbus A320neo')
 * @property {number} currentPrice - Price in USD
 * @property {Array<{ date: string, price: number }>} history - 30-60 day price history
 * @property {{
 *   min: number,
 *   minDate: string,
 *   max: number,
 *   maxDate: string,
 *   avg: number,
 *   change: number,
 *   changePct: number,
 *   recommendation: {
 *     action: 'Buy' | 'Wait',
 *     label: string,
 *     tone: 'emerald' | 'amber',
 *     reason: string
 *   }
 * }} stats - Key statistics & Buy vs Wait recommendation
 * @property {PlatformOffer[]} platformOffers - Strictly sorted ascending by totalPrice
 */

export {};
