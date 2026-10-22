/**
 * @file Curated airport catalogue of National (India) and International airports.
 * Each entry includes:
 *  - code: IATA 3-letter code
 *  - city: City name
 *  - name: Official airport name
 *  - country: ISO 2-letter country code
 *  - countryName: Full country name
 *  - lat, lon: Geocoordinates (used for distance, flight duration, and pricing)
 *  - tz: Standard UTC offset in hours
 */

export const AIRPORTS = [
  /* ========================================================================== */
  /*  NATIONAL AIRPORTS - INDIA (IN)                                            */
  /* ========================================================================== */
  // Metros & Major Hubs
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International', country: 'IN', countryName: 'India', lat: 28.5562, lon: 77.1000, tz: 5.5 },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International', country: 'IN', countryName: 'India', lat: 19.0896, lon: 72.8656, tz: 5.5 },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International', country: 'IN', countryName: 'India', lat: 13.1986, lon: 77.7066, tz: 5.5 },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International', country: 'IN', countryName: 'India', lat: 12.9941, lon: 80.1709, tz: 5.5 },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International', country: 'IN', countryName: 'India', lat: 17.2403, lon: 78.4294, tz: 5.5 },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International', country: 'IN', countryName: 'India', lat: 22.6547, lon: 88.4467, tz: 5.5 },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International', country: 'IN', countryName: 'India', lat: 23.0772, lon: 72.6347, tz: 5.5 },
  { code: 'PNQ', city: 'Pune', name: 'Pune International', country: 'IN', countryName: 'India', lat: 18.5822, lon: 73.9197, tz: 5.5 },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur International', country: 'IN', countryName: 'India', lat: 26.8242, lon: 75.8122, tz: 5.5 },

  // Goa
  { code: 'GOI', city: 'Goa (Dabolim)', name: 'Dabolim International', country: 'IN', countryName: 'India', lat: 15.3808, lon: 73.8314, tz: 5.5 },
  { code: 'GOX', city: 'Goa (Mopa)', name: 'Manohar International', country: 'IN', countryName: 'India', lat: 15.7667, lon: 73.8667, tz: 5.5 },

  // Kerala & Southern India
  { code: 'COK', city: 'Kochi', name: 'Cochin International', country: 'IN', countryName: 'India', lat: 10.1520, lon: 76.4019, tz: 5.5 },
  { code: 'TRV', city: 'Thiruvananthapuram', name: 'Trivandrum International', country: 'IN', countryName: 'India', lat: 8.4821, lon: 76.9200, tz: 5.5 },
  { code: 'CCJ', city: 'Kozhikode', name: 'Calicut International', country: 'IN', countryName: 'India', lat: 11.1362, lon: 75.9553, tz: 5.5 },
  { code: 'CNN', city: 'Kannur', name: 'Kannur International', country: 'IN', countryName: 'India', lat: 11.9172, lon: 75.5484, tz: 5.5 },
  { code: 'CJB', city: 'Coimbatore', name: 'Coimbatore International', country: 'IN', countryName: 'India', lat: 11.0297, lon: 77.0436, tz: 5.5 },
  { code: 'IXM', city: 'Madurai', name: 'Madurai Airport', country: 'IN', countryName: 'India', lat: 9.8344, lon: 78.0933, tz: 5.5 },
  { code: 'TRZ', city: 'Tiruchirappalli', name: 'Tiruchirappalli International', country: 'IN', countryName: 'India', lat: 10.7653, lon: 78.7097, tz: 5.5 },
  { code: 'TCR', city: 'Tuticorin', name: 'Tuticorin Airport', country: 'IN', countryName: 'India', lat: 8.7239, lon: 78.0264, tz: 5.5 },
  { code: 'SXV', city: 'Salem', name: 'Salem Airport', country: 'IN', countryName: 'India', lat: 11.7806, lon: 78.0642, tz: 5.5 },
  { code: 'IXE', city: 'Mangaluru', name: 'Mangaluru International', country: 'IN', countryName: 'India', lat: 12.9614, lon: 74.8900, tz: 5.5 },
  { code: 'HBX', city: 'Hubballi', name: 'Hubballi Airport', country: 'IN', countryName: 'India', lat: 15.3617, lon: 75.0847, tz: 5.5 },
  { code: 'IXG', city: 'Belagavi', name: 'Belagavi Airport', country: 'IN', countryName: 'India', lat: 15.8592, lon: 74.6183, tz: 5.5 },
  { code: 'MYQ', city: 'Mysuru', name: 'Mysore Airport', country: 'IN', countryName: 'India', lat: 12.2294, lon: 76.6508, tz: 5.5 },
  { code: 'GBI', city: 'Kalaburagi', name: 'Kalaburagi Airport', country: 'IN', countryName: 'India', lat: 17.3000, lon: 76.9000, tz: 5.5 },
  { code: 'RQY', city: 'Shivamogga', name: 'Kuvempu Airport', country: 'IN', countryName: 'India', lat: 13.8611, lon: 75.6444, tz: 5.5 },
  { code: 'VTZ', city: 'Visakhapatnam', name: 'Visakhapatnam International', country: 'IN', countryName: 'India', lat: 17.7211, lon: 83.2244, tz: 5.5 },
  { code: 'VGA', city: 'Vijayawada', name: 'Vijayawada International', country: 'IN', countryName: 'India', lat: 16.5303, lon: 80.7969, tz: 5.5 },
  { code: 'TIR', city: 'Tirupati', name: 'Tirupati Airport', country: 'IN', countryName: 'India', lat: 13.6325, lon: 79.5433, tz: 5.5 },
  { code: 'RJA', city: 'Rajahmundry', name: 'Rajahmundry Airport', country: 'IN', countryName: 'India', lat: 17.1103, lon: 81.8183, tz: 5.5 },
  { code: 'CDP', city: 'Kadapa', name: 'Kadapa Airport', country: 'IN', countryName: 'India', lat: 14.5100, lon: 78.7725, tz: 5.5 },
  { code: 'PNY', city: 'Puducherry', name: 'Puducherry Airport', country: 'IN', countryName: 'India', lat: 11.9686, lon: 79.8106, tz: 5.5 },
  { code: 'AGX', city: 'Agatti Island', name: 'Agatti Airport (Lakshadweep)', country: 'IN', countryName: 'India', lat: 10.8239, lon: 72.1764, tz: 5.5 },
  { code: 'IXZ', city: 'Port Blair', name: 'Veer Savarkar International (Andaman)', country: 'IN', countryName: 'India', lat: 11.6411, lon: 92.7297, tz: 5.5 },

  // Northern & Himalayan Region
  { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International', country: 'IN', countryName: 'India', lat: 26.7606, lon: 80.8893, tz: 5.5 },
  { code: 'VNS', city: 'Varanasi', name: 'Lal Bahadur Shastri International', country: 'IN', countryName: 'India', lat: 25.4524, lon: 82.8593, tz: 5.5 },
  { code: 'AYJ', city: 'Ayodhya', name: 'Maharishi Valmiki International', country: 'IN', countryName: 'India', lat: 26.7456, lon: 82.1558, tz: 5.5 },
  { code: 'IXD', city: 'Prayagraj', name: 'Prayagraj Airport (Allahabad)', country: 'IN', countryName: 'India', lat: 25.4399, lon: 81.7341, tz: 5.5 },
  { code: 'GOP', city: 'Gorakhpur', name: 'Mahayogi Gorakhnath Airport', country: 'IN', countryName: 'India', lat: 26.7397, lon: 83.4497, tz: 5.5 },
  { code: 'BEK', city: 'Bareilly', name: 'Bareilly Airport', country: 'IN', countryName: 'India', lat: 28.4222, lon: 79.4503, tz: 5.5 },
  { code: 'KNU', city: 'Kanpur', name: 'Kanpur Airport', country: 'IN', countryName: 'India', lat: 26.4406, lon: 80.4128, tz: 5.5 },
  { code: 'AGR', city: 'Agra', name: 'Agra Airport (Kheria)', country: 'IN', countryName: 'India', lat: 27.1558, lon: 77.9609, tz: 5.5 },
  { code: 'DED', city: 'Dehradun', name: 'Jolly Grant Airport', country: 'IN', countryName: 'India', lat: 30.1897, lon: 78.1803, tz: 5.5 },
  { code: 'PGH', city: 'Pantnagar', name: 'Pantnagar Airport', country: 'IN', countryName: 'India', lat: 29.0322, lon: 79.4736, tz: 5.5 },
  { code: 'ATQ', city: 'Amritsar', name: 'Sri Guru Ram Dass Jee International', country: 'IN', countryName: 'India', lat: 31.7096, lon: 74.7973, tz: 5.5 },
  { code: 'IXC', city: 'Chandigarh', name: 'Shaheed Bhagat Singh International', country: 'IN', countryName: 'India', lat: 30.6735, lon: 76.7885, tz: 5.5 },
  { code: 'SXR', city: 'Srinagar', name: 'Sheikh ul-Alam International', country: 'IN', countryName: 'India', lat: 33.9871, lon: 74.7741, tz: 5.5 },
  { code: 'IXJ', city: 'Jammu', name: 'Jammu Civil Enclave', country: 'IN', countryName: 'India', lat: 32.6891, lon: 74.8374, tz: 5.5 },
  { code: 'IXL', city: 'Leh', name: 'Kushok Bakula Rimpochee Airport', country: 'IN', countryName: 'India', lat: 34.1359, lon: 77.5465, tz: 5.5 },
  { code: 'DHM', city: 'Dharamshala', name: 'Kangra Airport', country: 'IN', countryName: 'India', lat: 32.1651, lon: 76.2634, tz: 5.5 },
  { code: 'KUU', city: 'Kullu', name: 'Bhuntar Airport (Manali)', country: 'IN', countryName: 'India', lat: 31.8767, lon: 77.1542, tz: 5.5 },

  // Western & Central India
  { code: 'STV', city: 'Surat', name: 'Surat International', country: 'IN', countryName: 'India', lat: 21.1142, lon: 72.7419, tz: 5.5 },
  { code: 'BDQ', city: 'Vadodara', name: 'Vadodara Airport', country: 'IN', countryName: 'India', lat: 22.3361, lon: 73.2264, tz: 5.5 },
  { code: 'RAJ', city: 'Rajkot', name: 'Rajkot International (Hirasar)', country: 'IN', countryName: 'India', lat: 22.3092, lon: 70.7794, tz: 5.5 },
  { code: 'BHU', city: 'Bhavnagar', name: 'Bhavnagar Airport', country: 'IN', countryName: 'India', lat: 21.7522, lon: 72.1856, tz: 5.5 },
  { code: 'JGA', city: 'Jamnagar', name: 'Jamnagar Airport', country: 'IN', countryName: 'India', lat: 22.4656, lon: 70.0125, tz: 5.5 },
  { code: 'PBD', city: 'Porbandar', name: 'Porbandar Airport', country: 'IN', countryName: 'India', lat: 21.6489, lon: 69.6572, tz: 5.5 },
  { code: 'IXY', city: 'Kandla', name: 'Kandla Airport (Gandhidham)', country: 'IN', countryName: 'India', lat: 23.1122, lon: 70.1006, tz: 5.5 },
  { code: 'UDR', city: 'Udaipur', name: 'Maharana Pratap Airport', country: 'IN', countryName: 'India', lat: 24.6178, lon: 73.8961, tz: 5.5 },
  { code: 'JDH', city: 'Jodhpur', name: 'Jodhpur Airport', country: 'IN', countryName: 'India', lat: 26.2511, lon: 73.0489, tz: 5.5 },
  { code: 'JSA', city: 'Jaisalmer', name: 'Jaisalmer Airport', country: 'IN', countryName: 'India', lat: 26.8889, lon: 70.8653, tz: 5.5 },
  { code: 'BKB', city: 'Bikaner', name: 'Nal Airport', country: 'IN', countryName: 'India', lat: 28.0706, lon: 73.2056, tz: 5.5 },
  { code: 'KQH', city: 'Kishangarh', name: 'Kishangarh Airport (Ajmer)', country: 'IN', countryName: 'India', lat: 26.5989, lon: 74.8136, tz: 5.5 },
  { code: 'NAG', city: 'Nagpur', name: 'Dr. Babasaheb Ambedkar International', country: 'IN', countryName: 'India', lat: 21.0922, lon: 79.0472, tz: 5.5 },
  { code: 'IXU', city: 'Chhatrapati Sambhajinagar', name: 'Aurangabad Airport', country: 'IN', countryName: 'India', lat: 19.8631, lon: 75.3981, tz: 5.5 },
  { code: 'SAG', city: 'Shirdi', name: 'Shirdi International', country: 'IN', countryName: 'India', lat: 19.6897, lon: 74.3761, tz: 5.5 },
  { code: 'KLH', city: 'Kolhapur', name: 'Chhatrapati Rajaram Maharaj Airport', country: 'IN', countryName: 'India', lat: 16.6644, lon: 74.2819, tz: 5.5 },
  { code: 'ISK', city: 'Nashik', name: 'Ozar Airport', country: 'IN', countryName: 'India', lat: 20.1194, lon: 73.9136, tz: 5.5 },
  { code: 'IDR', city: 'Indore', name: 'Devi Ahilyabai Holkar International', country: 'IN', countryName: 'India', lat: 22.7217, lon: 75.8011, tz: 5.5 },
  { code: 'BHO', city: 'Bhopal', name: 'Raja Bhoj Airport', country: 'IN', countryName: 'India', lat: 23.2875, lon: 77.3378, tz: 5.5 },
  { code: 'GWL', city: 'Gwalior', name: 'Rajmata Vijaya Raje Scindia Airport', country: 'IN', countryName: 'India', lat: 26.2933, lon: 78.2278, tz: 5.5 },
  { code: 'JLR', city: 'Jabalpur', name: 'Dumna Airport', country: 'IN', countryName: 'India', lat: 23.1778, lon: 80.0522, tz: 5.5 },

  // Eastern & East-Central India
  { code: 'PAT', city: 'Patna', name: 'Jayprakash Narayan International', country: 'IN', countryName: 'India', lat: 25.5913, lon: 85.0880, tz: 5.5 },
  { code: 'GAY', city: 'Gaya', name: 'Gaya International', country: 'IN', countryName: 'India', lat: 24.7443, lon: 84.9512, tz: 5.5 },
  { code: 'DBR', city: 'Darbhanga', name: 'Darbhanga Airport', country: 'IN', countryName: 'India', lat: 26.1950, lon: 85.9189, tz: 5.5 },
  { code: 'IXR', city: 'Ranchi', name: 'Birsa Munda Airport', country: 'IN', countryName: 'India', lat: 23.3143, lon: 85.3217, tz: 5.5 },
  { code: 'DGH', city: 'Deoghar', name: 'Deoghar Airport', country: 'IN', countryName: 'India', lat: 24.4439, lon: 86.7042, tz: 5.5 },
  { code: 'BBI', city: 'Bhubaneswar', name: 'Biju Patnaik International', country: 'IN', countryName: 'India', lat: 20.2444, lon: 85.8178, tz: 5.5 },
  { code: 'JRG', city: 'Jharsuguda', name: 'Veer Surendra Sai Airport', country: 'IN', countryName: 'India', lat: 21.9142, lon: 84.0503, tz: 5.5 },
  { code: 'RPR', city: 'Raipur', name: 'Swami Vivekananda Airport', country: 'IN', countryName: 'India', lat: 21.1804, lon: 81.7388, tz: 5.5 },
  { code: 'IXB', city: 'Bagdogra', name: 'Bagdogra International (Siliguri/Darjeeling)', country: 'IN', countryName: 'India', lat: 26.6811, lon: 88.3286, tz: 5.5 },
  { code: 'RDP', city: 'Durgapur', name: 'Kazi Nazrul Islam Airport', country: 'IN', countryName: 'India', lat: 23.6231, lon: 87.2425, tz: 5.5 },

  // North-East India
  { code: 'GAU', city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi International', country: 'IN', countryName: 'India', lat: 26.1061, lon: 91.5858, tz: 5.5 },
  { code: 'DIB', city: 'Dibrugarh', name: 'Dibrugarh Airport', country: 'IN', countryName: 'India', lat: 27.4839, lon: 95.0178, tz: 5.5 },
  { code: 'IXS', city: 'Silchar', name: 'Silchar Airport', country: 'IN', countryName: 'India', lat: 24.9128, lon: 92.9792, tz: 5.5 },
  { code: 'JRH', city: 'Jorhat', name: 'Jorhat Airport', country: 'IN', countryName: 'India', lat: 26.7317, lon: 94.1756, tz: 5.5 },
  { code: 'TEZ', city: 'Tezpur', name: 'Tezpur Airport', country: 'IN', countryName: 'India', lat: 26.7119, lon: 92.7972, tz: 5.5 },
  { code: 'IMF', city: 'Imphal', name: 'Bir Tikendrajit International', country: 'IN', countryName: 'India', lat: 24.7600, lon: 93.8967, tz: 5.5 },
  { code: 'IXA', city: 'Agartala', name: 'Maharaja Bir Bikram Airport', country: 'IN', countryName: 'India', lat: 23.8869, lon: 91.2406, tz: 5.5 },
  { code: 'DMU', city: 'Dimapur', name: 'Dimapur Airport', country: 'IN', countryName: 'India', lat: 25.8839, lon: 93.7711, tz: 5.5 },
  { code: 'AJL', city: 'Aizawl', name: 'Lengpui Airport', country: 'IN', countryName: 'India', lat: 23.8406, lon: 92.6194, tz: 5.5 },
  { code: 'SHL', city: 'Shillong', name: 'Umroi Airport', country: 'IN', countryName: 'India', lat: 25.7036, lon: 91.9789, tz: 5.5 },
  { code: 'HGI', city: 'Itanagar', name: 'Donyi Polo Airport (Hollongi)', country: 'IN', countryName: 'India', lat: 26.9800, lon: 93.6400, tz: 5.5 },
  { code: 'PYG', city: 'Pakyong', name: 'Pakyong Airport (Sikkim)', country: 'IN', countryName: 'India', lat: 27.2286, lon: 88.5881, tz: 5.5 },

  /* ========================================================================== */
  /*  INTERNATIONAL AIRPORTS - MIDDLE EAST & GULF                               */
  /* ========================================================================== */
  { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'AE', countryName: 'United Arab Emirates', lat: 25.2532, lon: 55.3657, tz: 4 },
  { code: 'DWC', city: 'Dubai (Al Maktoum)', name: 'Al Maktoum International', country: 'AE', countryName: 'United Arab Emirates', lat: 24.8961, lon: 55.1614, tz: 4 },
  { code: 'AUH', city: 'Abu Dhabi', name: 'Zayed International', country: 'AE', countryName: 'United Arab Emirates', lat: 24.4330, lon: 54.6511, tz: 4 },
  { code: 'SHJ', city: 'Sharjah', name: 'Sharjah International', country: 'AE', countryName: 'United Arab Emirates', lat: 25.3286, lon: 55.5172, tz: 4 },
  { code: 'DOH', city: 'Doha', name: 'Hamad International', country: 'QA', countryName: 'Qatar', lat: 25.2731, lon: 51.6081, tz: 3 },
  { code: 'BAH', city: 'Manama', name: 'Bahrain International', country: 'BH', countryName: 'Bahrain', lat: 26.2708, lon: 50.6336, tz: 3 },
  { code: 'KWI', city: 'Kuwait City', name: 'Kuwait International', country: 'KW', countryName: 'Kuwait', lat: 29.2267, lon: 47.9789, tz: 3 },
  { code: 'MCT', city: 'Muscat', name: 'Muscat International', country: 'OM', countryName: 'Oman', lat: 23.5933, lon: 58.2844, tz: 4 },
  { code: 'SLL', city: 'Salalah', name: 'Salalah International', country: 'OM', countryName: 'Oman', lat: 17.0389, lon: 54.0914, tz: 4 },
  { code: 'RUH', city: 'Riyadh', name: 'King Khalid International', country: 'SA', countryName: 'Saudi Arabia', lat: 24.9578, lon: 46.6989, tz: 3 },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz International', country: 'SA', countryName: 'Saudi Arabia', lat: 21.6796, lon: 39.1565, tz: 3 },
  { code: 'DMM', city: 'Dammam', name: 'King Fahd International', country: 'SA', countryName: 'Saudi Arabia', lat: 26.4711, lon: 49.7978, tz: 3 },
  { code: 'MED', city: 'Medina', name: 'Prince Mohammad bin Abdulaziz International', country: 'SA', countryName: 'Saudi Arabia', lat: 24.5539, lon: 39.7050, tz: 3 },
  { code: 'TLV', city: 'Tel Aviv', name: 'Ben Gurion International', country: 'IL', countryName: 'Israel', lat: 32.0055, lon: 34.8854, tz: 2 },
  { code: 'AMM', city: 'Amman', name: 'Queen Alia International', country: 'JO', countryName: 'Jordan', lat: 31.7225, lon: 35.9933, tz: 3 },
  { code: 'BEY', city: 'Beirut', name: 'Beirut-Rafic Hariri International', country: 'LB', countryName: 'Lebanon', lat: 33.8208, lon: 35.4883, tz: 2 },

  /* ========================================================================== */
  /*  INTERNATIONAL AIRPORTS - EUROPE                                           */
  /* ========================================================================== */
  // United Kingdom & Ireland
  { code: 'LHR', city: 'London (Heathrow)', name: 'Heathrow Airport', country: 'GB', countryName: 'United Kingdom', lat: 51.4700, lon: -0.4543, tz: 0 },
  { code: 'LGW', city: 'London (Gatwick)', name: 'Gatwick Airport', country: 'GB', countryName: 'United Kingdom', lat: 51.1537, lon: -0.1821, tz: 0 },
  { code: 'STN', city: 'London (Stansted)', name: 'Stansted Airport', country: 'GB', countryName: 'United Kingdom', lat: 51.8860, lon: 0.2389, tz: 0 },
  { code: 'LTN', city: 'London (Luton)', name: 'Luton Airport', country: 'GB', countryName: 'United Kingdom', lat: 51.8747, lon: -0.3683, tz: 0 },
  { code: 'MAN', city: 'Manchester', name: 'Manchester Airport', country: 'GB', countryName: 'United Kingdom', lat: 53.3537, lon: -2.2750, tz: 0 },
  { code: 'BHX', city: 'Birmingham', name: 'Birmingham Airport', country: 'GB', countryName: 'United Kingdom', lat: 52.4539, lon: -1.7481, tz: 0 },
  { code: 'EDI', city: 'Edinburgh', name: 'Edinburgh Airport', country: 'GB', countryName: 'United Kingdom', lat: 55.9500, lon: -3.3725, tz: 0 },
  { code: 'GLA', city: 'Glasgow', name: 'Glasgow Airport', country: 'GB', countryName: 'United Kingdom', lat: 55.8719, lon: -4.4331, tz: 0 },
  { code: 'DUB', city: 'Dublin', name: 'Dublin Airport', country: 'IE', countryName: 'Ireland', lat: 53.4214, lon: -6.2700, tz: 0 },

  // France & Benelux
  { code: 'CDG', city: 'Paris (Charles de Gaulle)', name: 'Charles de Gaulle Airport', country: 'FR', countryName: 'France', lat: 49.0097, lon: 2.5479, tz: 1 },
  { code: 'ORY', city: 'Paris (Orly)', name: 'Paris Orly Airport', country: 'FR', countryName: 'France', lat: 48.7233, lon: 2.3794, tz: 1 },
  { code: 'NCE', city: 'Nice', name: "Nice Côte d'Azur Airport", country: 'FR', countryName: 'France', lat: 43.6584, lon: 7.2159, tz: 1 },
  { code: 'LYS', city: 'Lyon', name: 'Lyon-Saint Exupéry Airport', country: 'FR', countryName: 'France', lat: 45.7256, lon: 5.0811, tz: 1 },
  { code: 'AMS', city: 'Amsterdam', name: 'Amsterdam Airport Schiphol', country: 'NL', countryName: 'Netherlands', lat: 52.3105, lon: 4.7683, tz: 1 },
  { code: 'BRU', city: 'Brussels', name: 'Brussels Airport', country: 'BE', countryName: 'Belgium', lat: 50.9014, lon: 4.4844, tz: 1 },

  // Germany, Austria & Switzerland
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport', country: 'DE', countryName: 'Germany', lat: 50.0379, lon: 8.5622, tz: 1 },
  { code: 'MUC', city: 'Munich', name: 'Munich Airport', country: 'DE', countryName: 'Germany', lat: 48.3537, lon: 11.7861, tz: 1 },
  { code: 'BER', city: 'Berlin', name: 'Berlin Brandenburg Airport', country: 'DE', countryName: 'Germany', lat: 52.3667, lon: 13.5033, tz: 1 },
  { code: 'HAM', city: 'Hamburg', name: 'Hamburg Airport', country: 'DE', countryName: 'Germany', lat: 53.6304, lon: 9.9882, tz: 1 },
  { code: 'DUS', city: 'Düsseldorf', name: 'Düsseldorf Airport', country: 'DE', countryName: 'Germany', lat: 51.2895, lon: 6.7668, tz: 1 },
  { code: 'VIE', city: 'Vienna', name: 'Vienna International', country: 'AT', countryName: 'Austria', lat: 48.1103, lon: 16.5697, tz: 1 },
  { code: 'ZRH', city: 'Zurich', name: 'Zurich Airport', country: 'CH', countryName: 'Switzerland', lat: 47.4582, lon: 8.5555, tz: 1 },
  { code: 'GVA', city: 'Geneva', name: 'Geneva Airport', country: 'CH', countryName: 'Switzerland', lat: 46.2381, lon: 6.1089, tz: 1 },

  // Southern Europe (Spain, Italy, Portugal, Greece)
  { code: 'MAD', city: 'Madrid', name: 'Adolfo Suárez Madrid-Barajas', country: 'ES', countryName: 'Spain', lat: 40.4839, lon: -3.5680, tz: 1 },
  { code: 'BCN', city: 'Barcelona', name: 'Josep Tarradellas Barcelona-El Prat', country: 'ES', countryName: 'Spain', lat: 41.2974, lon: 2.0833, tz: 1 },
  { code: 'AGP', city: 'Malaga', name: 'Málaga-Costa del Sol', country: 'ES', countryName: 'Spain', lat: 36.6749, lon: -4.4991, tz: 1 },
  { code: 'PMI', city: 'Palma de Mallorca', name: 'Palma de Mallorca Airport', country: 'ES', countryName: 'Spain', lat: 39.5517, lon: 2.7388, tz: 1 },
  { code: 'LIS', city: 'Lisbon', name: 'Humberto Delgado Airport', country: 'PT', countryName: 'Portugal', lat: 38.7742, lon: -9.1342, tz: 0 },
  { code: 'OPO', city: 'Porto', name: 'Francisco Sá Carneiro Airport', country: 'PT', countryName: 'Portugal', lat: 41.2481, lon: -8.6814, tz: 0 },
  { code: 'FCO', city: 'Rome (Fiumicino)', name: 'Leonardo da Vinci-Fiumicino', country: 'IT', countryName: 'Italy', lat: 41.8003, lon: 12.2389, tz: 1 },
  { code: 'MXP', city: 'Milan (Malpensa)', name: 'Milan Malpensa Airport', country: 'IT', countryName: 'Italy', lat: 45.6301, lon: 8.7255, tz: 1 },
  { code: 'LIN', city: 'Milan (Linate)', name: 'Linate Airport', country: 'IT', countryName: 'Italy', lat: 45.4451, lon: 9.2767, tz: 1 },
  { code: 'BGY', city: 'Milan (Bergamo)', name: 'Orio al Serio Airport', country: 'IT', countryName: 'Italy', lat: 45.6739, lon: 9.7042, tz: 1 },
  { code: 'VCE', city: 'Venice', name: 'Venice Marco Polo Airport', country: 'IT', countryName: 'Italy', lat: 45.5053, lon: 12.3519, tz: 1 },
  { code: 'NAP', city: 'Naples', name: 'Naples International', country: 'IT', countryName: 'Italy', lat: 40.8844, lon: 14.2908, tz: 1 },
  { code: 'ATH', city: 'Athens', name: 'Athens International', country: 'GR', countryName: 'Greece', lat: 37.9364, lon: 23.9472, tz: 2 },
  { code: 'HER', city: 'Heraklion (Crete)', name: 'Heraklion International', country: 'GR', countryName: 'Greece', lat: 35.3397, lon: 25.1803, tz: 2 },

  // Turkey & Eastern/Northern Europe
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'TR', countryName: 'Turkey', lat: 41.2753, lon: 28.7519, tz: 3 },
  { code: 'SAW', city: 'Istanbul (Sabiha Gökçen)', name: 'Sabiha Gökçen International', country: 'TR', countryName: 'Turkey', lat: 40.8986, lon: 29.3092, tz: 3 },
  { code: 'AYT', city: 'Antalya', name: 'Antalya Airport', country: 'TR', countryName: 'Turkey', lat: 36.8987, lon: 30.8005, tz: 3 },
  { code: 'CPH', city: 'Copenhagen', name: 'Copenhagen Airport', country: 'DK', countryName: 'Denmark', lat: 55.6180, lon: 12.6508, tz: 1 },
  { code: 'ARN', city: 'Stockholm', name: 'Stockholm Arlanda Airport', country: 'SE', countryName: 'Sweden', lat: 59.6498, lon: 17.9238, tz: 1 },
  { code: 'OSL', city: 'Oslo', name: 'Oslo Airport Gardermoen', country: 'NO', countryName: 'Norway', lat: 60.1975, lon: 11.1004, tz: 1 },
  { code: 'HEL', city: 'Helsinki', name: 'Helsinki-Vantaa Airport', country: 'FI', countryName: 'Finland', lat: 60.3172, lon: 24.9633, tz: 2 },
  { code: 'WAW', city: 'Warsaw', name: 'Warsaw Chopin Airport', country: 'PL', countryName: 'Poland', lat: 52.1672, lon: 20.9679, tz: 1 },
  { code: 'KRK', city: 'Krakow', name: 'John Paul II International Kraków-Balice', country: 'PL', countryName: 'Poland', lat: 50.0777, lon: 19.7848, tz: 1 },
  { code: 'PRG', city: 'Prague', name: 'Václav Havel Airport Prague', country: 'CZ', countryName: 'Czech Republic', lat: 50.1008, lon: 14.2600, tz: 1 },
  { code: 'BUD', city: 'Budapest', name: 'Budapest Ferenc Liszt International', country: 'HU', countryName: 'Hungary', lat: 47.4369, lon: 19.2556, tz: 1 },
  { code: 'OTP', city: 'Bucharest', name: 'Henri Coandă International', country: 'RO', countryName: 'Romania', lat: 44.5711, lon: 26.0850, tz: 2 },
  { code: 'KEF', city: 'Reykjavik', name: 'Keflavík International', country: 'IS', countryName: 'Iceland', lat: 63.9850, lon: -22.6056, tz: 0 },

  /* ========================================================================== */
  /*  INTERNATIONAL AIRPORTS - NORTH AMERICA (US, CA, MX)                       */
  /* ========================================================================== */
  // United States - East Coast & Midwest
  { code: 'JFK', city: 'New York (JFK)', name: 'John F. Kennedy International', country: 'US', countryName: 'United States', lat: 40.6413, lon: -73.7781, tz: -5 },
  { code: 'EWR', city: 'New York (Newark)', name: 'Newark Liberty International', country: 'US', countryName: 'United States', lat: 40.6895, lon: -74.1745, tz: -5 },
  { code: 'LGA', city: 'New York (LaGuardia)', name: 'LaGuardia Airport', country: 'US', countryName: 'United States', lat: 40.7769, lon: -73.8740, tz: -5 },
  { code: 'BOS', city: 'Boston', name: 'Logan International', country: 'US', countryName: 'United States', lat: 42.3656, lon: -71.0096, tz: -5 },
  { code: 'PHL', city: 'Philadelphia', name: 'Philadelphia International', country: 'US', countryName: 'United States', lat: 39.8729, lon: -75.2408, tz: -5 },
  { code: 'IAD', city: 'Washington D.C. (Dulles)', name: 'Washington Dulles International', country: 'US', countryName: 'United States', lat: 38.9531, lon: -77.4565, tz: -5 },
  { code: 'DCA', city: 'Washington D.C. (Reagan)', name: 'Ronald Reagan Washington National', country: 'US', countryName: 'United States', lat: 38.8512, lon: -77.0402, tz: -5 },
  { code: 'BWI', city: 'Baltimore', name: 'Baltimore/Washington International', country: 'US', countryName: 'United States', lat: 39.1754, lon: -76.6683, tz: -5 },
  { code: 'ATL', city: 'Atlanta', name: 'Hartsfield-Jackson Atlanta International', country: 'US', countryName: 'United States', lat: 33.6407, lon: -84.4277, tz: -5 },
  { code: 'MIA', city: 'Miami', name: 'Miami International', country: 'US', countryName: 'United States', lat: 25.7959, lon: -80.2870, tz: -5 },
  { code: 'MCO', city: 'Orlando', name: 'Orlando International', country: 'US', countryName: 'United States', lat: 28.4312, lon: -81.3081, tz: -5 },
  { code: 'FLL', city: 'Fort Lauderdale', name: 'Fort Lauderdale-Hollywood International', country: 'US', countryName: 'United States', lat: 26.0742, lon: -80.1506, tz: -5 },
  { code: 'ORD', city: 'Chicago (O\'Hare)', name: "O'Hare International", country: 'US', countryName: 'United States', lat: 41.9742, lon: -87.9073, tz: -6 },
  { code: 'MDW', city: 'Chicago (Midway)', name: 'Chicago Midway International', country: 'US', countryName: 'United States', lat: 41.7868, lon: -87.7522, tz: -6 },
  { code: 'DTW', city: 'Detroit', name: 'Detroit Metropolitan Wayne County', country: 'US', countryName: 'United States', lat: 42.2162, lon: -83.3554, tz: -5 },
  { code: 'MSP', city: 'Minneapolis', name: 'Minneapolis-Saint Paul International', country: 'US', countryName: 'United States', lat: 44.8848, lon: -93.2223, tz: -6 },
  { code: 'CLT', city: 'Charlotte', name: 'Charlotte Douglas International', country: 'US', countryName: 'United States', lat: 35.2140, lon: -80.9431, tz: -5 },
  { code: 'BNA', city: 'Nashville', name: 'Nashville International', country: 'US', countryName: 'United States', lat: 36.1263, lon: -86.6774, tz: -6 },

  // United States - Texas, Mountain & West Coast
  { code: 'DFW', city: 'Dallas/Fort Worth', name: 'Dallas/Fort Worth International', country: 'US', countryName: 'United States', lat: 32.8998, lon: -97.0403, tz: -6 },
  { code: 'IAH', city: 'Houston (Bush)', name: 'George Bush Intercontinental', country: 'US', countryName: 'United States', lat: 29.9902, lon: -95.3368, tz: -6 },
  { code: 'AUS', city: 'Austin', name: 'Austin-Bergstrom International', country: 'US', countryName: 'United States', lat: 30.1975, lon: -97.6664, tz: -6 },
  { code: 'DEN', city: 'Denver', name: 'Denver International', country: 'US', countryName: 'United States', lat: 39.8561, lon: -104.6737, tz: -7 },
  { code: 'PHX', city: 'Phoenix', name: 'Phoenix Sky Harbor International', country: 'US', countryName: 'United States', lat: 33.4373, lon: -112.0078, tz: -7 },
  { code: 'LAS', city: 'Las Vegas', name: 'Harry Reid International', country: 'US', countryName: 'United States', lat: 36.0840, lon: -115.1537, tz: -8 },
  { code: 'SLC', city: 'Salt Lake City', name: 'Salt Lake City International', country: 'US', countryName: 'United States', lat: 40.7899, lon: -111.9791, tz: -7 },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International', country: 'US', countryName: 'United States', lat: 33.9416, lon: -118.4085, tz: -8 },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco International', country: 'US', countryName: 'United States', lat: 37.6213, lon: -122.3790, tz: -8 },
  { code: 'SJC', city: 'San Jose', name: 'Norman Y. Mineta San José International', country: 'US', countryName: 'United States', lat: 37.3639, lon: -121.9289, tz: -8 },
  { code: 'SAN', city: 'San Diego', name: 'San Diego International', country: 'US', countryName: 'United States', lat: 32.7338, lon: -117.1933, tz: -8 },
  { code: 'SEA', city: 'Seattle', name: 'Seattle-Tacoma International', country: 'US', countryName: 'United States', lat: 47.4502, lon: -122.3088, tz: -8 },
  { code: 'PDX', city: 'Portland', name: 'Portland International', country: 'US', countryName: 'United States', lat: 45.5898, lon: -122.5951, tz: -8 },
  { code: 'HNL', city: 'Honolulu', name: 'Daniel K. Inouye International (Hawaii)', country: 'US', countryName: 'United States', lat: 21.3187, lon: -157.9224, tz: -10 },

  // Canada & Mexico
  { code: 'YYZ', city: 'Toronto (Pearson)', name: 'Toronto Pearson International', country: 'CA', countryName: 'Canada', lat: 43.6777, lon: -79.6248, tz: -5 },
  { code: 'YVR', city: 'Vancouver', name: 'Vancouver International', country: 'CA', countryName: 'Canada', lat: 49.1967, lon: -123.1815, tz: -8 },
  { code: 'YUL', city: 'Montreal', name: 'Montréal-Trudeau International', country: 'CA', countryName: 'Canada', lat: 45.4657, lon: -73.7455, tz: -5 },
  { code: 'YYC', city: 'Calgary', name: 'Calgary International', country: 'CA', countryName: 'Canada', lat: 51.1215, lon: -114.0076, tz: -7 },
  { code: 'YOW', city: 'Ottawa', name: 'Ottawa Macdonald-Cartier International', country: 'CA', countryName: 'Canada', lat: 45.3225, lon: -75.6692, tz: -5 },
  { code: 'MEX', city: 'Mexico City', name: 'Benito Juárez International', country: 'MX', countryName: 'Mexico', lat: 19.4361, lon: -99.0719, tz: -6 },
  { code: 'CUN', city: 'Cancun', name: 'Cancún International', country: 'MX', countryName: 'Mexico', lat: 21.0365, lon: -86.8771, tz: -5 },
  { code: 'GDL', city: 'Guadalajara', name: 'Miguel Hidalgo y Costilla International', country: 'MX', countryName: 'Mexico', lat: 20.5218, lon: -103.3111, tz: -6 },

  /* ========================================================================== */
  /*  INTERNATIONAL AIRPORTS - ASIA-PACIFIC, EAST & SOUTHEAST ASIA              */
  /* ========================================================================== */
  { code: 'SIN', city: 'Singapore', name: 'Singapore Changi Airport', country: 'SG', countryName: 'Singapore', lat: 1.3644, lon: 103.9915, tz: 8 },
  { code: 'BKK', city: 'Bangkok (Suvarnabhumi)', name: 'Suvarnabhumi Airport', country: 'TH', countryName: 'Thailand', lat: 13.6900, lon: 100.7501, tz: 7 },
  { code: 'DMK', city: 'Bangkok (Don Mueang)', name: 'Don Mueang International', country: 'TH', countryName: 'Thailand', lat: 13.9126, lon: 100.6068, tz: 7 },
  { code: 'HKT', city: 'Phuket', name: 'Phuket International', country: 'TH', countryName: 'Thailand', lat: 8.1132, lon: 98.3169, tz: 7 },
  { code: 'CNX', city: 'Chiang Mai', name: 'Chiang Mai International', country: 'TH', countryName: 'Thailand', lat: 18.7668, lon: 98.9626, tz: 7 },
  { code: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur International', country: 'MY', countryName: 'Malaysia', lat: 2.7456, lon: 101.7099, tz: 8 },
  { code: 'PEN', city: 'Penang', name: 'Penang International', country: 'MY', countryName: 'Malaysia', lat: 5.2971, lon: 100.2769, tz: 8 },
  { code: 'CGK', city: 'Jakarta', name: 'Soekarno-Hatta International', country: 'ID', countryName: 'Indonesia', lat: -6.1275, lon: 106.6537, tz: 7 },
  { code: 'DPS', city: 'Bali (Denpasar)', name: 'Ngurah Rai International', country: 'ID', countryName: 'Indonesia', lat: -8.7482, lon: 115.1672, tz: 8 },
  { code: 'MNL', city: 'Manila', name: 'Ninoy Aquino International', country: 'PH', countryName: 'Philippines', lat: 14.5086, lon: 121.0194, tz: 8 },
  { code: 'CEB', city: 'Cebu', name: 'Mactan-Cebu International', country: 'PH', countryName: 'Philippines', lat: 10.3075, lon: 123.9794, tz: 8 },
  { code: 'SGN', city: 'Ho Chi Minh City', name: 'Tan Son Nhat International', country: 'VN', countryName: 'Vietnam', lat: 10.8188, lon: 106.6519, tz: 7 },
  { code: 'HAN', city: 'Hanoi', name: 'Noi Bai International', country: 'VN', countryName: 'Vietnam', lat: 21.2212, lon: 105.8072, tz: 7 },
  { code: 'DAD', city: 'Da Nang', name: 'Da Nang International', country: 'VN', countryName: 'Vietnam', lat: 16.0439, lon: 108.1994, tz: 7 },
  { code: 'PNH', city: 'Phnom Penh', name: 'Phnom Penh International', country: 'KH', countryName: 'Cambodia', lat: 11.5466, lon: 104.8441, tz: 7 },
  { code: 'REP', city: 'Siem Reap', name: 'Siem Reap-Angkor International', country: 'KH', countryName: 'Cambodia', lat: 13.3667, lon: 103.8500, tz: 7 },

  // East Asia (Japan, South Korea, China, Taiwan, Hong Kong)
  { code: 'HND', city: 'Tokyo (Haneda)', name: 'Tokyo Haneda Airport', country: 'JP', countryName: 'Japan', lat: 35.5494, lon: 139.7798, tz: 9 },
  { code: 'NRT', city: 'Tokyo (Narita)', name: 'Narita International', country: 'JP', countryName: 'Japan', lat: 35.7720, lon: 140.3929, tz: 9 },
  { code: 'KIX', city: 'Osaka (Kansai)', name: 'Kansai International', country: 'JP', countryName: 'Japan', lat: 34.4347, lon: 135.2441, tz: 9 },
  { code: 'ITM', city: 'Osaka (Itami)', name: 'Itami Airport', country: 'JP', countryName: 'Japan', lat: 34.7855, lon: 135.4382, tz: 9 },
  { code: 'FUK', city: 'Fukuoka', name: 'Fukuoka Airport', country: 'JP', countryName: 'Japan', lat: 33.5859, lon: 130.4507, tz: 9 },
  { code: 'CTS', city: 'Sapporo', name: 'New Chitose Airport', country: 'JP', countryName: 'Japan', lat: 42.7752, lon: 141.6923, tz: 9 },
  { code: 'ICN', city: 'Seoul (Incheon)', name: 'Incheon International', country: 'KR', countryName: 'South Korea', lat: 37.4602, lon: 126.4407, tz: 9 },
  { code: 'GMP', city: 'Seoul (Gimpo)', name: 'Gimpo International', country: 'KR', countryName: 'South Korea', lat: 37.5583, lon: 126.7906, tz: 9 },
  { code: 'PUS', city: 'Busan', name: 'Gimhae International', country: 'KR', countryName: 'South Korea', lat: 35.1795, lon: 128.9382, tz: 9 },
  { code: 'PEK', city: 'Beijing (Capital)', name: 'Beijing Capital International', country: 'CN', countryName: 'China', lat: 40.0799, lon: 116.6031, tz: 8 },
  { code: 'PKX', city: 'Beijing (Daxing)', name: 'Beijing Daxing International', country: 'CN', countryName: 'China', lat: 39.5098, lon: 116.4105, tz: 8 },
  { code: 'PVG', city: 'Shanghai (Pudong)', name: 'Shanghai Pudong International', country: 'CN', countryName: 'China', lat: 31.1443, lon: 121.8083, tz: 8 },
  { code: 'SHA', city: 'Shanghai (Hongqiao)', name: 'Shanghai Hongqiao International', country: 'CN', countryName: 'China', lat: 31.1979, lon: 121.3363, tz: 8 },
  { code: 'CAN', city: 'Guangzhou', name: 'Guangzhou Baiyun International', country: 'CN', countryName: 'China', lat: 23.3924, lon: 113.2988, tz: 8 },
  { code: 'SZX', city: 'Shenzhen', name: "Shenzhen Bao'an International", country: 'CN', countryName: 'China', lat: 22.6393, lon: 113.8107, tz: 8 },
  { code: 'TFU', city: 'Chengdu', name: 'Chengdu Tianfu International', country: 'CN', countryName: 'China', lat: 30.3200, lon: 104.4450, tz: 8 },
  { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International', country: 'HK', countryName: 'Hong Kong', lat: 22.3080, lon: 113.9185, tz: 8 },
  { code: 'MFM', city: 'Macau', name: 'Macau International', country: 'MO', countryName: 'Macau', lat: 22.1496, lon: 113.5916, tz: 8 },
  { code: 'TPE', city: 'Taipei', name: 'Taiwan Taoyuan International', country: 'TW', countryName: 'Taiwan', lat: 25.0797, lon: 121.2342, tz: 8 },

  // South Asia, Central Asia & Indian Subcontinent
  { code: 'CMB', city: 'Colombo', name: 'Bandaranaike International', country: 'LK', countryName: 'Sri Lanka', lat: 7.1808, lon: 79.8841, tz: 5.5 },
  { code: 'MLE', city: 'Malé', name: 'Velana International (Maldives)', country: 'MV', countryName: 'Maldives', lat: 4.1918, lon: 73.5291, tz: 5 },
  { code: 'KTM', city: 'Kathmandu', name: 'Tribhuvan International', country: 'NP', countryName: 'Nepal', lat: 27.6966, lon: 85.3591, tz: 5.75 },
  { code: 'DAC', city: 'Dhaka', name: 'Hazrat Shahjalal International', country: 'BD', countryName: 'Bangladesh', lat: 23.8433, lon: 90.3978, tz: 6 },
  { code: 'PBH', city: 'Paro', name: 'Paro International (Bhutan)', country: 'BT', countryName: 'Bhutan', lat: 27.4032, lon: 89.4246, tz: 6 },
  { code: 'TAS', city: 'Tashkent', name: 'Islam Karimov Tashkent International', country: 'UZ', countryName: 'Uzbekistan', lat: 41.2579, lon: 69.2812, tz: 5 },
  { code: 'ALA', city: 'Almaty', name: 'Almaty International', country: 'KZ', countryName: 'Kazakhstan', lat: 43.3521, lon: 77.0405, tz: 5 },

  // Oceania (Australia & New Zealand)
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith Airport', country: 'AU', countryName: 'Australia', lat: -33.9399, lon: 151.1753, tz: 10 },
  { code: 'MEL', city: 'Melbourne', name: 'Melbourne Airport', country: 'AU', countryName: 'Australia', lat: -37.6690, lon: 144.8410, tz: 10 },
  { code: 'BNE', city: 'Brisbane', name: 'Brisbane Airport', country: 'AU', countryName: 'Australia', lat: -27.3842, lon: 153.1175, tz: 10 },
  { code: 'PER', city: 'Perth', name: 'Perth Airport', country: 'AU', countryName: 'Australia', lat: -31.9385, lon: 115.9672, tz: 8 },
  { code: 'ADL', city: 'Adelaide', name: 'Adelaide Airport', country: 'AU', countryName: 'Australia', lat: -34.9450, lon: 138.5306, tz: 9.5 },
  { code: 'AKL', city: 'Auckland', name: 'Auckland Airport', country: 'NZ', countryName: 'New Zealand', lat: -37.0082, lon: 174.7850, tz: 12 },
  { code: 'CHC', city: 'Christchurch', name: 'Christchurch International', country: 'NZ', countryName: 'New Zealand', lat: -43.4864, lon: 172.5322, tz: 12 },
  { code: 'NAN', city: 'Nadi', name: 'Nadi International (Fiji)', country: 'FJ', countryName: 'Fiji', lat: -17.7554, lon: 177.4434, tz: 12 },

  /* ========================================================================== */
  /*  INTERNATIONAL AIRPORTS - AFRICA, SOUTH AMERICA & CARIBBEAN                */
  /* ========================================================================== */
  { code: 'CAI', city: 'Cairo', name: 'Cairo International', country: 'EG', countryName: 'Egypt', lat: 30.1219, lon: 31.4056, tz: 2 },
  { code: 'JNB', city: 'Johannesburg', name: 'O.R. Tambo International', country: 'ZA', countryName: 'South Africa', lat: -26.1367, lon: 28.2411, tz: 2 },
  { code: 'CPT', city: 'Cape Town', name: 'Cape Town International', country: 'ZA', countryName: 'South Africa', lat: -33.9715, lon: 18.6021, tz: 2 },
  { code: 'NBO', city: 'Nairobi', name: 'Jomo Kenyatta International', country: 'KE', countryName: 'Kenya', lat: -1.3192, lon: 36.9278, tz: 3 },
  { code: 'ADD', city: 'Addis Ababa', name: 'Addis Ababa Bole International', country: 'ET', countryName: 'Ethiopia', lat: 8.9779, lon: 38.7993, tz: 3 },
  { code: 'CMN', city: 'Casablanca', name: 'Mohammed V International', country: 'MA', countryName: 'Morocco', lat: 33.3675, lon: -7.5897, tz: 1 },
  { code: 'MRU', city: 'Port Louis', name: 'Sir Seewoosagur Ramgoolam (Mauritius)', country: 'MU', countryName: 'Mauritius', lat: -20.4302, lon: 57.6836, tz: 4 },
  { code: 'SEZ', city: 'Victoria (Mahé)', name: 'Seychelles International', country: 'SC', countryName: 'Seychelles', lat: -4.6743, lon: 55.5219, tz: 4 },

  { code: 'GRU', city: 'São Paulo', name: 'São Paulo/Guarulhos International', country: 'BR', countryName: 'Brazil', lat: -23.4356, lon: -46.4731, tz: -3 },
  { code: 'GIG', city: 'Rio de Janeiro', name: 'Rio de Janeiro/Galeão International', country: 'BR', countryName: 'Brazil', lat: -22.8089, lon: -43.2436, tz: -3 },
  { code: 'EZE', city: 'Buenos Aires', name: 'Ministro Pistarini International (Ezeiza)', country: 'AR', countryName: 'Argentina', lat: -34.8222, lon: -58.5358, tz: -3 },
  { code: 'SCL', city: 'Santiago', name: 'Arturo Merino Benítez International', country: 'CL', countryName: 'Chile', lat: -33.3930, lon: -70.7858, tz: -4 },
  { code: 'BOG', city: 'Bogotá', name: 'El Dorado International', country: 'CO', countryName: 'Colombia', lat: 4.7016, lon: -74.1469, tz: -5 },
  { code: 'LIM', city: 'Lima', name: 'Jorge Chávez International', country: 'PE', countryName: 'Peru', lat: -12.0219, lon: -77.1143, tz: -5 },
  { code: 'PTY', city: 'Panama City', name: 'Tocumen International', country: 'PA', countryName: 'Panama', lat: 9.0714, lon: -79.3835, tz: -5 },
  { code: 'SJU', city: 'San Juan', name: 'Luis Muñoz Marín International (Puerto Rico)', country: 'PR', countryName: 'Puerto Rico', lat: 18.4394, lon: -66.0018, tz: -4 },
];

export const AIRPORT_BY_CODE = Object.fromEntries(AIRPORTS.map((a) => [a.code, a]));

const stripAccents = (str) =>
  (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Searches and ranks airports for autocomplete:
 * 1. Exact IATA code match (e.g. "DEL")
 * 2. IATA code prefix (e.g. "DE")
 * 3. City exact match (e.g. "Goa")
 * 4. City prefix (e.g. "Mum")
 * 5. Airport name match
 * 6. Country name match (e.g. "India", "United States", "Japan")
 */
export function searchAirports(query, { exclude } = {}) {
  const q = stripAccents(query).trim();
  const pool = AIRPORTS.filter((a) => a.code !== exclude);

  // If input is empty, return popular curated domestic & international hubs
  if (!q) {
    const popularCodes = [
      'DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU', 'GOI', 'COK',
      'DXB', 'LHR', 'SIN', 'BKK', 'JFK', 'SFO', 'HND'
    ];
    const populars = popularCodes
      .map((c) => AIRPORT_BY_CODE[c])
      .filter((a) => a && a.code !== exclude);
    return populars.slice(0, 8);
  }

  return pool
    .map((a) => {
      const code = a.code.toLowerCase();
      const city = stripAccents(a.city);
      const name = stripAccents(a.name);
      const countryCode = a.country.toLowerCase();
      const countryName = stripAccents(a.countryName);

      let score = 0;
      if (code === q) score = 100;
      else if (code.startsWith(q)) score = 85;
      else if (city === q) score = 80;
      else if (city.startsWith(q)) score = 75;
      else if (name.startsWith(q)) score = 65;
      else if (city.includes(q)) score = 55;
      else if (name.includes(q)) score = 40;
      else if (countryName.startsWith(q)) score = 35;
      else if (countryName.includes(q) || countryCode === q) score = 25;

      return { a, score };
    })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score || x.a.city.localeCompare(y.a.city))
    .slice(0, 10)
    .map((r) => r.a);
}
