'use client';

import { useState, useEffect } from 'react';

export default function BiddingPage() {
  const [bidPeriods, setBidPeriods] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [availablePairings, setAvailablePairings] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock crew ID - in production this would come from authentication
  const crewId = 1;

  useEffect(() => {
    loadBidPeriods();
  }, []);

  useEffect(() => {
    if (selectedPeriod) {
      loadAvailablePairings();
      loadMyBids();
    }
  }, [selectedPeriod]);

  const loadBidPeriods = async () => {
    try {
      const res = await fetch('/api/bidding/periods');
      const data = await res.json();
      setBidPeriods(data.bid_periods || []);
      
      // Auto-select first open period
      const openPeriod = data.bid_periods?.find((p: any) => {
        const now = new Date();
        return now >= new Date(p.bidding_opens_at) && now <= new Date(p.bidding_closes_at);
      });
      
      if (openPeriod) {
        setSelectedPeriod(openPeriod);
      }
    } catch (err) {
      setError('Failed to load bid periods');
    }
  };

  const loadAvailablePairings = async () => {
    if (!selectedPeriod) return;
    
    try {
      const res = await fetch(
        `/api/pairings?aircraft_type=${selectedPeriod.aircraft_type}&month=${selectedPeriod.month}&year=${selectedPeriod.year}`
      );
      const data = await res.json();
      setAvailablePairings(data.pairings || []);
    } catch (err) {
      console.error('Failed to load pairings:', err);
    }
  };

  const loadMyBids = async () => {
    if (!selectedPeriod) return;
    
    try {
      const res = await fetch(
        `/api/bidding/bids?crew_id=${crewId}&bid_period_id=${selectedPeriod.id}`
      );
      const data = await res.json();
      setMyBids(data.bids || []);
    } catch (err) {
      console.error('Failed to load bids:', err);
    }
  };

  const submitBid = async (pairingId: number) => {
    setLoading(true);
    setError(null);

    try {
      const nextPriority = myBids.length + 1;
      
      const res = await fetch('/api/bidding/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crew_id: crewId,
          bid_period_id: selectedPeriod.id,
          pairing_id: pairingId,
          bid_priority: nextPriority,
          bid_type: 'preference'
        })
      });

      const data = await res.json();

      if (res.ok) {
        await loadMyBids();
      } else {
        setError(data.error || 'Failed to submit bid');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    }

    setLoading(false);
  };

  const deleteBid = async (bidId: number) => {
    try {
      const res = await fetch(`/api/bidding/bids?bid_id=${bidId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await loadMyBids();
      }
    } catch (err) {
      console.error('Failed to delete bid:', err);
    }
  };

  const isBiddingOpen = selectedPeriod && new Date() >= new Date(selectedPeriod.bidding_opens_at) && 
                        new Date() <= new Date(selectedPeriod.bidding_closes_at);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Preferential Bidding System
          </h1>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Submit your pairing preferences for upcoming roster periods
          </p>

          {/* Bid Period Selector */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bid Period
            </label>
            <select
              value={selectedPeriod?.id || ''}
              onChange={(e) => {
                const period = bidPeriods.find(p => p.id === parseInt(e.target.value));
                setSelectedPeriod(period);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm md:text-base"
            >
              <option value="">-- Select Period --</option>
              {bidPeriods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.aircraft_type} - {new Date(2025, period.month - 1).toLocaleString('default', { month: 'long' })} {period.year}
                  {period.processing_status === 'completed' && ' (Closed)'}
                </option>
              ))}
            </select>

            {selectedPeriod && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs md:text-sm">
                <div>
                  <p className="text-gray-600">Bidding Opens</p>
                  <p className="font-semibold">
                    {new Date(selectedPeriod.bidding_opens_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Bidding Closes</p>
                  <p className="font-semibold">
                    {new Date(selectedPeriod.bidding_closes_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {selectedPeriod && (
              <div className="mt-4">
                {isBiddingOpen ? (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-sm">
                    ✅ Bidding is currently OPEN
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded text-sm">
                    ❌ Bidding is CLOSED
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {selectedPeriod && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Bids */}
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  My Bids ({myBids.length})
                </h2>
                
                {myBids.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-600 text-sm">No bids submitted yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myBids.map((bid, index) => (
                      <div key={bid.id} className="bg-white border border-gray-300 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-sm md:text-base">
                              Priority #{bid.bid_priority}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600">
                              {bid.pairing_code}
                            </p>
                          </div>
                          {isBiddingOpen && (
                            <button
                              onClick={() => deleteBid(bid.id)}
                              className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          <p>{new Date(bid.start_date).toLocaleDateString()} - {new Date(bid.end_date).toLocaleDateString()}</p>
                          <p>{bid.total_flight_hours}h flight time, {bid.layover_count} layovers</p>
                        </div>
                        {bid.status !== 'pending' && (
                          <div className={`mt-2 text-xs font-semibold ${
                            bid.status === 'awarded' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {bid.status === 'awarded' ? '✅ AWARDED' : '❌ DENIED'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Pairings */}
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  Available Pairings
                </h2>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {availablePairings.map(pairing => {
                    const alreadyBid = myBids.some(b => b.pairing_id === pairing.id);
                    
                    return (
                      <div key={pairing.id} className="bg-white border border-gray-300 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-sm md:text-base">
                              {pairing.pairing_code}
                            </p>
                            <p className="text-xs text-gray-600">
                              {pairing.start_airport} → {pairing.end_airport}
                            </p>
                          </div>
                          {isBiddingOpen && !alreadyBid && (
                            <button
                              onClick={() => submitBid(pairing.id)}
                              disabled={loading}
                              className="px-3 py-1 bg-blue-600 text-white text-xs md:text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              Bid
                            </button>
                          )}
                          {alreadyBid && (
                            <span className="text-xs text-green-600 font-semibold">
                              ✓ Bid
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          <p>{new Date(pairing.start_date).toLocaleDateString()} - {new Date(pairing.end_date).toLocaleDateString()}</p>
                          <p>{pairing.total_flight_hours}h flight, {pairing.total_duty_hours}h duty, {pairing.layover_count} layovers</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

