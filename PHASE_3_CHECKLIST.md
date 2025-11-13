# Phase 3: Preferential Bidding System (PBS)

## Objective
Build a comprehensive bidding system where crew can submit preferences for pairings and rosters are awarded based on seniority

## Timeline
2-3 hours

---

## Features to Implement

### 1. Bid Period Management
- Create bid periods for each month/aircraft type
- Set bidding open and close dates
- Manage bid period status (pending, open, closed, processing, completed)

### 2. Crew Bidding Interface
- Display available pairings for bidding
- Allow crew to select and rank pairings by priority
- Support "preference" and "avoid" bid types
- Real-time validation of bids
- Save draft bids
- Submit final bids

### 3. Bid Processing Engine
- Process all crew bids after bidding closes
- Award pairings based on seniority
- Handle conflicts and overlaps
- Generate optimized rosters from awarded bids
- Notify crew of bid results

### 4. Bid Award Algorithm
- Sort crew by seniority
- Process highest seniority first
- Award highest priority available pairings
- Check for conflicts and regulations
- Continue until all pairings assigned or all bids processed

### 5. API Endpoints
- POST /api/bidding/periods - Create bid period
- GET /api/bidding/periods - List bid periods
- GET /api/bidding/periods/[id] - Get bid period details
- POST /api/bidding/periods/[id]/close - Close bidding
- POST /api/bidding/periods/[id]/process - Process bids
- POST /api/bidding/bids - Submit crew bid
- GET /api/bidding/bids/my-bids - Get crew's bids
- PUT /api/bidding/bids/[id] - Update bid
- DELETE /api/bidding/bids/[id] - Delete bid

### 6. UI Pages
- Bid period management (/admin/bidding/periods)
- Available pairings for bidding (/bidding/pairings)
- My bids page (/bidding/my-bids)
- Bid results page (/bidding/results)

---

## Deliverables

1. ✅ Bid period management system
2. ✅ Crew bidding interface
3. ✅ Bid processing engine
4. ✅ Bid award algorithm
5. ✅ API endpoints for bidding
6. ✅ UI pages for crew and admin
7. ✅ Notification system for bid results

---

## Success Criteria

- Crew can submit bids for available pairings
- Bids are processed correctly based on seniority
- System handles 500+ crew bidding simultaneously
- Bid processing completes in < 2 minutes
- All awards comply with regulations
- Crew receive notifications of results

---

## Bid Processing Algorithm

```
1. Load all bids for bid period
2. Load all available pairings
3. Sort crew by seniority (highest first)
4. For each crew member (in seniority order):
   a. Load their bids sorted by priority
   b. For each bid:
      - Check if pairing is still available
      - Check if pairing conflicts with already awarded pairings
      - Check regulation compliance
      - If all checks pass: award pairing
   c. Mark remaining bids as denied
5. Generate rosters from awarded pairings
6. Notify all crew of results
```

---

## Notes

- Bidding typically opens 45-60 days before roster month
- Bidding window is usually 7-14 days
- Senior crew get first choice of pairings
- System must handle ties in seniority
- Support for "standing bids" (recurring preferences)

