/**
 * @file Helper to generate authentic deep-search and official booking URLs
 * for Online Travel Agencies (OTAs) and direct airline portals.
 */

export const AIRLINE_DIRECT_URLS = {
  AI: 'https://www.airindia.com',
  '6E': 'https://www.goindigo.in',
  QP: 'https://www.akasaair.com',
  SG: 'https://www.spicejet.com',
  IX: 'https://www.airindiaexpress.com',
  EK: 'https://www.emirates.com',
  EY: 'https://www.etihad.com',
  QR: 'https://www.qatarairways.com',
  BA: 'https://www.britishairways.com',
  VS: 'https://www.virginatlantic.com',
  LH: 'https://www.lufthansa.com',
  AF: 'https://www.airfrance.com',
  KL: 'https://www.klm.com',
  TK: 'https://www.turkishairlines.com',
  UA: 'https://www.united.com',
  DL: 'https://www.delta.com',
  AA: 'https://www.aa.com',
  B6: 'https://www.jetblue.com',
  AS: 'https://www.alaskaair.com',
  AC: 'https://www.aircanada.com',
  SQ: 'https://www.singaporeair.com',
  TG: 'https://www.thaiairways.com',
  NH: 'https://www.ana.co.jp',
  CX: 'https://www.cathaypacific.com',
  QF: 'https://www.qantas.com',
};

/**
 * Parses any date representation into strict { y, m, d } components.
 * Guarantees 4-digit year, 2-digit month (01-12), and 2-digit day (01-31).
 */
export function extractDateParts(dateInput) {
  if (typeof dateInput === 'string' && dateInput.includes('-')) {
    const parts = dateInput.trim().split('-');
    if (parts.length === 3) {
      const y = parts[0];
      const m = parts[1].padStart(2, '0');
      const d = parts[2].padStart(2, '0');
      return { y, m, d };
    }
  }

  const dt = dateInput ? new Date(dateInput) : new Date();
  const validDt = isNaN(dt.getTime()) ? new Date() : dt;

  const y = String(validDt.getFullYear());
  const m = String(validDt.getMonth() + 1).padStart(2, '0');
  const d = String(validDt.getDate()).padStart(2, '0');
  return { y, m, d };
}

/**
 * Builds a working deep-search or direct booking URL for a specific platform.
 * Formats dates according to each OTA's exact parsing specification:
 * - MakeMyTrip: itinerary=ORIG-DEST-DD/MM/YYYY (strictly slashed DD/MM/YYYY, no hyphens)
 * - Cleartrip: depart_date=DD/MM/YYYY
 * - Ixigo: date=DDMMYYYY
 * - Skyscanner: /flights/orig/dest/YYMMDD/
 * - Yatra: flight_depart_date=DD%2FMM%2FYYYY
 * - Google Flights: flights from ORIG to DEST on YYYY-MM-DD
 */
export function getBookingUrl(platformId, airline, origin = 'DEL', destination = 'BOM', date = '', cabinClass = 'economy') {
  const orig = ((typeof origin === 'object' ? origin?.code : origin) || 'DEL').toUpperCase();
  const dest = ((typeof destination === 'object' ? destination?.code : destination) || 'BOM').toUpperCase();

  const { y, m, d } = extractDateParts(date);

  const ddmmyyyySlash = `${d}/${m}/${y}`;       // e.g. "25/10/2026"
  const ddmmyyyyFlat = `${d}${m}${y}`;         // e.g. "25102026"
  const yymmdd = `${y.slice(-2)}${m}${d}`;     // e.g. "261025"
  const isoDate = `${y}-${m}-${d}`;            // e.g. "2026-10-25"

  const cabin = (cabinClass || 'economy').toLowerCase();

  switch (platformId) {
    case 'direct': {
      const code = airline?.code?.toUpperCase();
      if (code && AIRLINE_DIRECT_URLS[code]) return AIRLINE_DIRECT_URLS[code];
      const cleanName = (airline?.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanName ? `https://www.${cleanName}.com` : `https://www.google.com/travel/flights?q=flights+from+${orig}+to+${dest}+on+${isoDate}`;
    }

    case 'makemytrip': {
      // MakeMyTrip parses `itinerary` by splitting on '-'.
      // Therefore the date segment MUST NOT contain hyphens and MUST be DD/MM/YYYY.
      const mmtCabin = cabin === 'business' ? 'B' : cabin === 'premium' ? 'PE' : 'E';
      return `https://www.makemytrip.com/flight/search?itinerary=${orig}-${dest}-${ddmmyyyySlash}&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=${mmtCabin}&ccde=IN&lang=eng`;
    }

    case 'cleartrip': {
      // Cleartrip expects depart_date in DD/MM/YYYY
      const ctCabin = cabin === 'business' ? 'Business' : cabin === 'premium' ? 'Premium+Economy' : 'Economy';
      return `https://www.cleartrip.com/flights/results?from=${orig}&to=${dest}&depart_date=${ddmmyyyySlash}&adults=1&childs=0&infants=0&class=${ctCabin}`;
    }

    case 'ixigo': {
      // Ixigo web search requires date as DDMMYYYY
      const ixiCabin = cabin === 'business' ? 'b' : cabin === 'premium' ? 'p' : 'e';
      return `https://www.ixigo.com/search/flight/results?from=${orig}&to=${dest}&date=${ddmmyyyyFlat}&adults=1&children=0&infants=0&class=${ixiCabin}`;
    }

    case 'skyscanner': {
      // Skyscanner transport route view with short date YYMMDD
      const skyCabin = cabin === 'business' ? 'business' : cabin === 'premium' ? 'premiumeconomy' : 'economy';
      return `https://www.skyscanner.co.in/transport/flights/${orig.toLowerCase()}/${dest.toLowerCase()}/${yymmdd}/?adultsv2=1&cabinclass=${skyCabin}&rtn=0&preferdirects=false`;
    }

    case 'yatra': {
      // Yatra trigger URL with URL-encoded date DD%2FMM%2FYYYY
      const encodedDate = encodeURIComponent(ddmmyyyySlash);
      return `https://flight.yatra.com/air-search-ui/dom2/trigger?type=O&viewName=normal&flexi=0&noOfSegments=1&origin=${orig}&originCountry=IN&destination=${dest}&destinationCountry=IN&flight_depart_date=${encodedDate}&ADT=1&CHD=0&INF=0&class=Economy`;
    }

    case 'google_flights': {
      return `https://www.google.com/travel/flights?q=flights+from+${orig}+to+${dest}+on+${isoDate}+one+way`;
    }

    default:
      return `https://www.google.com/travel/flights?q=flights+from+${orig}+to+${dest}+on+${isoDate}+one+way`;
  }
}
