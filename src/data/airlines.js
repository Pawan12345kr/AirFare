/**
 * @file Comprehensive Airlines Directory
 * Includes domestic Indian carriers, major flag carriers, and international airlines.
 * `hubs` drives connecting route generation, `tier` drives realistic fare pricing,
 * and `numRange` shapes authentic flight numbers (e.g. AI-805, 6E-2134, EK-501).
 */

export const AIRLINES = {
  // India (Domestic & International)
  AI: {
    code: 'AI',
    name: 'Air India',
    country: 'IN',
    hubs: ['DEL', 'BOM', 'BLR', 'CCU', 'MAA', 'HYD', 'AMD', 'COK'],
    destinations: null, // Universal national flag carrier: flies to all primary, state-capital, and regional airports
    tier: 'full',
    numRange: [101, 999],
    color: '#C8102E'
  },
  '6E': {
    code: '6E',
    name: 'IndiGo',
    country: 'IN',
    hubs: ['DEL', 'BOM', 'BLR', 'HYD', 'CCU', 'MAA', 'AMD', 'COK', 'GOI', 'PNQ', 'JAI', 'LKO'],
    destinations: null, // Dominant national carrier (>60% domestic market): serves all 85+ commercial airports in India
    tier: 'lcc',
    numRange: [2001, 6999],
    color: '#1B2A80'
  },
  QP: {
    code: 'QP',
    name: 'Akasa Air',
    country: 'IN',
    hubs: ['BOM', 'DEL', 'BLR', 'AMD', 'HYD', 'GOI', 'CCU', 'PNQ', 'LKO'],
    // Akasa Air has a strict, limited route network — does NOT serve Ranchi (IXR), Srinagar (SXR), Leh, etc.
    destinations: [
      'BOM', 'DEL', 'BLR', 'AMD', 'GOI', 'HYD', 'CCU', 'VNS', 'LKO',
      'GAU', 'PNQ', 'COK', 'TRV', 'STV', 'IXB', 'GAY', 'IXZ', 'GWL', 'AYJ'
    ],
    tier: 'lcc',
    numRange: [1101, 1799],
    color: '#FF6A13'
  },
  SG: {
    code: 'SG',
    name: 'SpiceJet',
    country: 'IN',
    hubs: ['DEL', 'BOM', 'CCU', 'JAI', 'AMD', 'GOI', 'SXR'],
    // SpiceJet route network — does not operate direct Delhi-Ranchi flights
    destinations: [
      'DEL', 'BOM', 'CCU', 'JAI', 'AMD', 'GOI', 'SXR', 'IXL', 'DED',
      'VTZ', 'GAU', 'IXB', 'BLR', 'HYD', 'PNQ', 'GWL', 'AYJ', 'JDH', 'UDR', 'KNU', 'IXZ', 'TIR', 'SHL'
    ],
    tier: 'lcc',
    numRange: [101, 999],
    color: '#E31E24'
  },
  IX: {
    code: 'IX',
    name: 'Air India Express',
    country: 'IN',
    hubs: ['COK', 'CCJ', 'TRV', 'DEL', 'BOM', 'BLR', 'CNN', 'IXE', 'MAA', 'LKO', 'VNS'],
    // Air India Express network — serves Delhi, Ranchi (IXR), Gulf and Tier-2 network
    destinations: [
      'DEL', 'BOM', 'BLR', 'CCU', 'HYD', 'MAA', 'COK', 'CCJ', 'TRV',
      'CNN', 'IXE', 'LKO', 'VNS', 'IXR', 'GAU', 'AYJ', 'JAI', 'GOI',
      'PNQ', 'IXB', 'BBI', 'PAT', 'IXA', 'IMF', 'IXZ', 'TRZ', 'IXM', 'VTZ', 'VJA',
      'DXB', 'SHJ', 'AUH', 'DOH', 'BAH', 'KWI', 'MCT', 'SIN'
    ],
    tier: 'lcc',
    numRange: [1101, 2999],
    color: '#D2232A'
  },
  UK: {
    code: 'UK',
    name: 'Vistara',
    country: 'IN',
    hubs: ['DEL', 'BOM', 'BLR'],
    destinations: [
      'DEL', 'BOM', 'BLR', 'CCU', 'MAA', 'HYD', 'AMD', 'GOI', 'PNQ',
      'COK', 'IXB', 'GAU', 'PAT', 'BBI', 'VNS', 'LKO', 'DED', 'SXR', 'IXL', 'TRV',
      'LHR', 'DXB', 'SIN', 'BKK', 'FRA'
    ],
    tier: 'full',
    numRange: [701, 999],
    color: '#582C4D'
  },

  // Middle East & Gulf
  EK: { code: 'EK', name: 'Emirates', country: 'AE', hubs: ['DXB'], tier: 'premium', numRange: [1, 599], color: '#D71921' },
  FZ: { code: 'FZ', name: 'flydubai', country: 'AE', hubs: ['DXB'], tier: 'lcc', numRange: [1, 999], color: '#0083C9' },
  EY: { code: 'EY', name: 'Etihad Airways', country: 'AE', hubs: ['AUH'], tier: 'full', numRange: [1, 499], color: '#BD8B13' },
  QR: { code: 'QR', name: 'Qatar Airways', country: 'QA', hubs: ['DOH'], tier: 'premium', numRange: [1, 999], color: '#5C0632' },
  G9: { code: 'G9', name: 'Air Arabia', country: 'AE', hubs: ['SHJ'], tier: 'lcc', numRange: [1, 999], color: '#E21A22' },
  SV: { code: 'SV', name: 'Saudia', country: 'SA', hubs: ['JED', 'RUH'], tier: 'full', numRange: [1, 999], color: '#006C35' },
  WY: { code: 'WY', name: 'Oman Air', country: 'OM', hubs: ['MCT'], tier: 'full', numRange: [1, 499], color: '#B31B1B' },
  GF: { code: 'GF', name: 'Gulf Air', country: 'BH', hubs: ['BAH'], tier: 'full', numRange: [1, 499], color: '#9B7A2F' },
  KU: { code: 'KU', name: 'Kuwait Airways', country: 'KW', hubs: ['KWI'], tier: 'full', numRange: [1, 499], color: '#00539F' },

  // Europe
  BA: { code: 'BA', name: 'British Airways', country: 'GB', hubs: ['LHR', 'LGW'], tier: 'full', numRange: [1, 299], color: '#075AAA' },
  VS: { code: 'VS', name: 'Virgin Atlantic', country: 'GB', hubs: ['LHR'], tier: 'full', numRange: [1, 399], color: '#E1163C' },
  LH: { code: 'LH', name: 'Lufthansa', country: 'DE', hubs: ['FRA', 'MUC'], tier: 'full', numRange: [400, 799], color: '#05164D' },
  AF: { code: 'AF', name: 'Air France', country: 'FR', hubs: ['CDG'], tier: 'full', numRange: [1, 399], color: '#002157' },
  KL: { code: 'KL', name: 'KLM', country: 'NL', hubs: ['AMS'], tier: 'full', numRange: [600, 899], color: '#00A1DE' },
  TK: { code: 'TK', name: 'Turkish Airlines', country: 'TR', hubs: ['IST'], tier: 'full', numRange: [1, 999], color: '#C70A0C' },
  LX: { code: 'LX', name: 'SWISS', country: 'CH', hubs: ['ZRH', 'GVA'], tier: 'full', numRange: [1, 399], color: '#E50000' },
  OS: { code: 'OS', name: 'Austrian Airlines', country: 'AT', hubs: ['VIE'], tier: 'full', numRange: [1, 399], color: '#D90000' },
  IB: { code: 'IB', name: 'Iberia', country: 'ES', hubs: ['MAD'], tier: 'full', numRange: [1, 999], color: '#D71921' },
  TP: { code: 'TP', name: 'TAP Air Portugal', country: 'PT', hubs: ['LIS'], tier: 'full', numRange: [1, 999], color: '#009639' },
  AZ: { code: 'AZ', name: 'ITA Airways', country: 'IT', hubs: ['FCO', 'MXP'], tier: 'full', numRange: [1, 999], color: '#004B87' },
  AY: { code: 'AY', name: 'Finnair', country: 'FI', hubs: ['HEL'], tier: 'full', numRange: [1, 399], color: '#0B1560' },

  // North America
  UA: { code: 'UA', name: 'United Airlines', country: 'US', hubs: ['EWR', 'SFO', 'ORD', 'IAD', 'DEN', 'IAH', 'LAX'], tier: 'full', numRange: [1, 2999], color: '#005DAA' },
  DL: { code: 'DL', name: 'Delta Air Lines', country: 'US', hubs: ['JFK', 'LAX', 'ATL', 'DTW', 'MSP', 'SEA', 'BOS'], tier: 'full', numRange: [1, 2999], color: '#C01933' },
  AA: { code: 'AA', name: 'American Airlines', country: 'US', hubs: ['JFK', 'ORD', 'LAX', 'DFW', 'MIA', 'CLT', 'PHX'], tier: 'full', numRange: [1, 2999], color: '#0078D2' },
  B6: { code: 'B6', name: 'JetBlue', country: 'US', hubs: ['JFK', 'BOS', 'FLL'], tier: 'lcc', numRange: [1, 2999], color: '#003876' },
  AS: { code: 'AS', name: 'Alaska Airlines', country: 'US', hubs: ['SFO', 'LAX', 'SEA', 'PDX'], tier: 'lcc', numRange: [1, 1999], color: '#01426A' },
  WN: { code: 'WN', name: 'Southwest Airlines', country: 'US', hubs: ['MDW', 'DAL', 'DEN', 'LAS', 'PHX', 'HOU', 'BWI'], tier: 'lcc', numRange: [1, 2999], color: '#304CB2' },
  AC: { code: 'AC', name: 'Air Canada', country: 'CA', hubs: ['YYZ', 'YVR', 'YUL', 'YYC'], tier: 'full', numRange: [1, 999], color: '#D22630' },
  AM: { code: 'AM', name: 'Aeromexico', country: 'MX', hubs: ['MEX'], tier: 'full', numRange: [1, 999], color: '#0B2341' },

  // Asia-Pacific & East Asia
  SQ: { code: 'SQ', name: 'Singapore Airlines', country: 'SG', hubs: ['SIN'], tier: 'premium', numRange: [1, 999], color: '#F2A900' },
  TG: { code: 'TG', name: 'Thai Airways', country: 'TH', hubs: ['BKK'], tier: 'full', numRange: [300, 999], color: '#4B2A84' },
  NH: { code: 'NH', name: 'ANA', country: 'JP', hubs: ['HND', 'NRT'], tier: 'premium', numRange: [1, 999], color: '#13448F' },
  JL: { code: 'JL', name: 'Japan Airlines', country: 'JP', hubs: ['HND', 'NRT'], tier: 'premium', numRange: [1, 999], color: '#CC0000' },
  CX: { code: 'CX', name: 'Cathay Pacific', country: 'HK', hubs: ['HKG'], tier: 'premium', numRange: [100, 999], color: '#006564' },
  MH: { code: 'MH', name: 'Malaysia Airlines', country: 'MY', hubs: ['KUL'], tier: 'full', numRange: [1, 999], color: '#002B7F' },
  VN: { code: 'VN', name: 'Vietnam Airlines', country: 'VN', hubs: ['SGN', 'HAN'], tier: 'full', numRange: [1, 999], color: '#00557F' },
  PR: { code: 'PR', name: 'Philippine Airlines', country: 'PH', hubs: ['MNL'], tier: 'full', numRange: [1, 999], color: '#0038A8' },
  GA: { code: 'GA', name: 'Garuda Indonesia', country: 'ID', hubs: ['CGK', 'DPS'], tier: 'full', numRange: [1, 999], color: '#1F5A82' },
  KE: { code: 'KE', name: 'Korean Air', country: 'KR', hubs: ['ICN'], tier: 'full', numRange: [1, 999], color: '#002E6D' },

  // Oceania
  QF: { code: 'QF', name: 'Qantas', country: 'AU', hubs: ['SYD', 'MEL', 'BNE', 'PER'], tier: 'full', numRange: [1, 999], color: '#E40000' },
  NZ: { code: 'NZ', name: 'Air New Zealand', country: 'NZ', hubs: ['AKL', 'CHC'], tier: 'full', numRange: [1, 999], color: '#000000' },

  // Africa & Latin America
  ET: { code: 'ET', name: 'Ethiopian Airlines', country: 'ET', hubs: ['ADD'], tier: 'full', numRange: [1, 999], color: '#008542' },
  MS: { code: 'MS', name: 'EgyptAir', country: 'EG', hubs: ['CAI'], tier: 'full', numRange: [1, 999], color: '#002F6C' },
  SA: { code: 'SA', name: 'South African Airways', country: 'ZA', hubs: ['JNB'], tier: 'full', numRange: [1, 999], color: '#002454' },
  LA: { code: 'LA', name: 'LATAM Airlines', country: 'BR', hubs: ['GRU', 'SCL', 'LIM', 'BOG'], tier: 'full', numRange: [1, 999], color: '#E4002B' },
  AV: { code: 'AV', name: 'Avianca', country: 'CO', hubs: ['BOG', 'SAL'], tier: 'full', numRange: [1, 999], color: '#E30613' },
  CM: { code: 'CM', name: 'Copa Airlines', country: 'PA', hubs: ['PTY'], tier: 'full', numRange: [1, 999], color: '#003366' },
};
