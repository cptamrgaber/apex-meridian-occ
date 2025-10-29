# FlightAware AeroAPI Research Notes

## Overview
- **Name:** AeroAPI (formerly FlightXML)
- **Provider:** FlightAware
- **Data Format:** REST/JSON
- **Coverage:** Millions of flight status inputs worldwide

## Key Features
- Real-time flight tracking
- Historical flight data
- Flight status (past and present)
- Query-based API
- 100 result sets/second rate limit

## Pricing Structure
- **Per-query usage fees** (subject to monthly minimum)
- Pricing is per result set (15 results = 1 result set)
- Requires paid subscription
- No free tier available

## Decision
**Status:** NOT SUITABLE for this project
**Reason:** Requires paid subscription, no free tier

## Alternative: Continue with OpenSky Network
- Free and open source
- Good coverage for ADS-B data
- Need to fix connection issues
- May need to add retry logic and better error handling

## Recommendation
1. Fix OpenSky Network integration with better error handling
2. Add retry logic for failed requests
3. Implement caching to reduce API calls
4. Keep demo fallback data for reliability
5. Consider ADS-B Exchange as backup (also free)

