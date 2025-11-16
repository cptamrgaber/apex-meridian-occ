# Mock Data Replacement Plan

**Goal:** Replace ALL fake/placeholder/mock data with real EgyptAir database  
**Date:** November 15, 2025  
**Status:** IN PROGRESS  

---

## Real Data Available ✅

### Complete EgyptAir Database:
- ✅ **541 Real Captains** - `captains.json` (230K)
  - Full names, ranks, license numbers, nationalities
  - Aircraft type qualifications
  - Contact information
  
- ✅ **326 Real Flights** - `flights_complete.json` (139K)
  - Flight numbers (MS001-MS999)
  - Routes, schedules, frequencies
  - Aircraft assignments
  - Departure/arrival times
  
- ✅ **67 Real Aircraft** - `aircraft_complete.json` (13K)
  - Registrations (SU-GCM, SU-GCN, etc.)
  - Aircraft types (B737, B777, B787, A320, A330, etc.)
  - Serial numbers, delivery dates
  - Status (Active/Inactive)
  
- ✅ **95 Real Airports** - `airports_complete.json` (18K)
  - IATA/ICAO codes
  - Names, locations, countries
  - Regional classifications

---

## Progress Status

### ✅ COMPLETED (2/20)
1. ✅ `/api/crew` - Now uses real 541 captains
2. ✅ `/api/dashboard/stats` - Now uses real counts

### 🔄 IN PROGRESS (0/18)
None currently

### ⏳ PENDING (18/20)
3. ⏳ `/api/alerts` - Still using mock alerts
4. ⏳ `/api/notifications` - Still using mock notifications
5. ⏳ `/api/roster/generate` - Still using mock crew assignments
6. ⏳ `/app/chief-pilot/page.tsx` - Still using mockChiefPilots
7. ⏳ `/app/chief-pilot/roster/[id]/page.tsx` - Still using mockMonthlyRosters
8. ⏳ `/app/compliance/page.tsx` - Still using mock compliance checks
9. ⏳ `/app/crew-dashboard/page.tsx` - Still using mock crew data
10. ⏳ `/data/fleet-management-mock.ts` - Entire mock data file needs replacement
11. ⏳ Crew page - May show fake names
12. ⏳ Fleet page - May show fake aircraft
13. ⏳ Schedule page - May show fake flights
14. ⏳ Roster page - May show fake assignments
15. ⏳ Routes page - May show fake routes
16. ⏳ Weather page - May use mock data
17. ⏳ Analytics page - May use mock metrics
18. ⏳ Notifications page - May show fake notifications
19. ⏳ Compliance page - May show fake checks
20. ⏳ OM-A Assistant page - May use placeholder data

---

## Detailed Replacement Plan

### Phase 1: Core APIs (COMPLETED ✅)
- [x] `/api/crew` → Use real captains database
- [x] `/api/dashboard/stats` → Use real counts from all databases

### Phase 2: Fleet Management System (HIGH PRIORITY)
- [ ] Create `fleet-management-real.ts` to replace `fleet-management-mock.ts`
- [ ] Generate real chief pilots from captains database
  - Filter by rank (Captain, Senior Captain)
  - Assign aircraft types based on qualifications
- [ ] Generate real crew assignments from captains
- [ ] Create real monthly rosters using real flights + real captains
- [ ] Update all chief pilot pages to use real data

### Phase 3: Operational APIs (MEDIUM PRIORITY)
- [ ] `/api/alerts` → Generate from real flight delays/issues
- [ ] `/api/notifications` → Generate from real operational events
- [ ] `/api/roster/generate` → Use real captains + real flights

### Phase 4: Frontend Pages (MEDIUM PRIORITY)
- [ ] Crew page → Display real 541 captains
- [ ] Fleet page → Display real 67 aircraft
- [ ] Schedule page → Display real 326 flights
- [ ] Routes page → Display real routes from flights database
- [ ] Roster page → Display real crew assignments

### Phase 5: Advanced Features (LOW PRIORITY)
- [ ] Compliance page → Generate real compliance checks from OM-A rules
- [ ] Analytics page → Calculate real metrics from flight data
- [ ] Weather page → Integrate real weather API
- [ ] Crew dashboard → Show real crew member data

---

## Implementation Strategy

### Step 1: Create Real Data Generators
```typescript
// src/lib/real-data-generators.ts
export function generateChiefPilotsFromCaptains() {
  // Filter captains by rank and experience
  // Assign to aircraft types
  // Return real chief pilot objects
}

export function generateCrewAssignmentsFromCaptains() {
  // Create crew assignments from real captains
  // Assign to aircraft types
  // Set status based on availability
}

export function generateRostersFromFlightsAndCaptains() {
  // Match real flights with real captains
  // Create monthly rosters
  // Ensure compliance with duty time limits
}
```

### Step 2: Replace Mock Data File
```typescript
// Replace: src/data/fleet-management-mock.ts
// With: src/data/fleet-management-real.ts
// Using real captains, flights, aircraft data
```

### Step 3: Update All Imports
```typescript
// Find all files importing from fleet-management-mock
// Replace with fleet-management-real
// Test each page
```

### Step 4: Remove Mock Data
```bash
# Delete mock data file
rm src/data/fleet-management-mock.ts

# Search for any remaining "mock" references
grep -r "mock" src/ --include="*.ts" --include="*.tsx"
```

---

## Estimated Timeline

- **Phase 1:** ✅ DONE (30 minutes)
- **Phase 2:** 2-3 hours (Fleet management system)
- **Phase 3:** 1-2 hours (Operational APIs)
- **Phase 4:** 2-3 hours (Frontend pages)
- **Phase 5:** 1-2 hours (Advanced features)

**Total:** 6-10 hours of development work

---

## Testing Checklist

After each replacement:
- [ ] Check page loads without errors
- [ ] Verify real names appear (not "John Doe", "Jane Smith")
- [ ] Verify real aircraft registrations (SU-GCM, not "N12345")
- [ ] Verify real flight numbers (MS777, not "AA1234")
- [ ] Verify real airports (CAI, not "JFK" for all flights)
- [ ] Check console for errors
- [ ] Test on multiple pages
- [ ] Deploy and verify in production

---

## Current Deployment Status

**Latest Commit:** 25d7e27 - "fix: Replace mock data with real EgyptAir database in crew and stats APIs"  
**Deployed:** Waiting for Vercel build  
**Progress:** 10% complete (2/20 items)

---

## Next Immediate Steps

1. Create `fleet-management-real.ts` with real data generators
2. Update chief pilot pages to use real captains
3. Update roster generation to use real flights + captains
4. Test and deploy
5. Continue with remaining pages

---

## Notes

- Mock data is deeply integrated across many files
- This is a systematic refactoring, not a quick fix
- Each component needs careful testing
- Some features may need redesign to work with real data structure
- Priority: Most visible pages first (dashboard, crew, fleet, schedule)

---

**Recommendation:** Complete this in phases, testing and deploying after each phase to ensure stability.

