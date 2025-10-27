# OpenSky Network API Documentation

## Base URL
```
https://opensky-network.org/api
```

## Key Endpoints

### 1. All State Vectors
**Endpoint:** `GET /states/all`

**Purpose:** Retrieve real-time state vectors (position, velocity, altitude) for aircraft

**Rate Limits:**
- Anonymous: 10 requests per minute
- Authenticated: 400 requests per minute (requires OpenSky account)

**Request Parameters:**
- `time` (integer): Unix timestamp to retrieve states for
- `icao24` (string): ICAO24 transponder address (hex). Can be repeated for multiple aircraft
- `lamin`, `lomin`, `lamax`, `lomax` (float): Bounding box coordinates
- `extended` (integer): Set to 1 to get aircraft category

**Response Structure:**
```json
{
  "time": 1234567890,
  "states": [
    [
      "icao24",        // 0: Unique ICAO 24-bit address
      "callsign",      // 1: Callsign (8 chars)
      "origin_country",// 2: Country name
      time_position,   // 3: Unix timestamp for last position
      last_contact,    // 4: Unix timestamp for last update
      longitude,       // 5: WGS-84 longitude
      latitude,        // 6: WGS-84 latitude
      baro_altitude,   // 7: Barometric altitude (meters)
      on_ground,       // 8: Boolean - on ground
      velocity,        // 9: Velocity over ground (m/s)
      true_track,      // 10: True track (degrees from north)
      vertical_rate,   // 11: Vertical rate (m/s)
      sensors,         // 12: Receiver IDs
      geo_altitude,    // 13: Geometric altitude (meters)
      squawk,          // 14: Transponder code
      spi,             // 15: Special purpose indicator
      position_source, // 16: 0=ADS-B, 1=ASTERIX, 2=MLAT, 3=FLARM
      category         // 17: Aircraft category (0-20)
    ]
  ]
}
```

### 2. Flights by Aircraft
**Endpoint:** `GET /flights/aircraft`

**Purpose:** Get flights for a specific aircraft in a time interval

**Parameters:**
- `icao24` (required): ICAO24 address
- `begin` (required): Unix timestamp - start of interval
- `end` (required): Unix timestamp - end of interval

### 3. Arrivals by Airport
**Endpoint:** `GET /flights/arrival`

**Parameters:**
- `airport` (required): ICAO airport code (e.g., HECA for Cairo)
- `begin` (required): Unix timestamp
- `end` (required): Unix timestamp

### 4. Departures by Airport
**Endpoint:** `GET /flights/departure`

**Parameters:**
- `airport` (required): ICAO airport code
- `begin` (required): Unix timestamp
- `end` (required): Unix timestamp

## EgyptAir Specific Information

### ICAO Codes:
- **Airline ICAO:** MSR
- **Callsign Prefix:** MSR (e.g., MSR123)

### Major Airports:
- **Cairo International (HECA)** - Main hub
- **Hurghada International (HEGN)**
- **Sharm El Sheikh International (HESH)**
- **Luxor International (HELX)**
- **Aswan International (HESN)**
- **Alexandria Borg El Arab (HEBA)**

### Fleet Information:
EgyptAir operates approximately 60+ aircraft including:
- Airbus A220-300
- Airbus A320 family
- Airbus A330-200/300
- Boeing 737-800
- Boeing 787-9 Dreamliner

## Implementation Strategy

### 1. Get EgyptAir Fleet ICAO24 Codes
We need to identify all ICAO24 transponder codes for EgyptAir aircraft. These can be obtained from:
- OpenSky Aircraft Database
- Manual lookup for known registrations (SU-GDx series)

### 2. Real-Time Tracking
- Poll `/states/all` endpoint with EgyptAir callsign filter
- Filter by callsign starting with "MSR"
- Update every 10-30 seconds

### 3. Historical Flights
- Use `/flights/aircraft` for specific aircraft history
- Use `/flights/departure` and `/flights/arrival` for airport-based history

### 4. Future Flights
- OpenSky doesn't provide scheduled flights
- Need to integrate with another API (AviationStack, FlightAware) or use static schedule data

## Rate Limit Management

**Anonymous Access:**
- 10 requests/minute
- 4000 requests/day

**Authenticated Access (Recommended):**
- Create free OpenSky account
- 400 requests/minute
- Much higher daily limit

## Example API Calls

### Get all EgyptAir flights currently in the air:
```
GET https://opensky-network.org/api/states/all
```
Then filter response for callsigns starting with "MSR"

### Get flights from Cairo Airport in last 24 hours:
```
GET https://opensky-network.org/api/flights/departure?airport=HECA&begin=1698364800&end=1698451200
```

### Get specific aircraft history:
```
GET https://opensky-network.org/api/flights/aircraft?icao24=010203&begin=1698364800&end=1698451200
```

## Notes

- OpenSky provides **free** real-time and historical flight data
- Data is crowdsourced from ADS-B receivers worldwide
- Coverage is best in Europe and North America
- Middle East coverage may be limited but still useful
- No API key required for basic access
- Authentication increases rate limits significantly

