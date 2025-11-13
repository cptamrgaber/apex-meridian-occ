'use client';

import { useState, useEffect } from 'react';

export default function TradeRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [crewId, setCrewId] = useState('');
  const [offeredFlightId, setOfferedFlightId] = useState('');
  const [requestedFlightId, setRequestedFlightId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    const res = await fetch('/api/trade-requests');
    const data = await res.json();
    setRequests(data.data || data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/trade-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crewId: Number(crewId),
        offeredFlightId: Number(offeredFlightId),
        requestedFlightId: Number(requestedFlightId),
      }),
    });
    setCrewId('');
    setOfferedFlightId('');
    setRequestedFlightId('');
    await fetchRequests();
    setLoading(false);
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-semibold'>Trade Requests</h1>
      <form onSubmit={handleSubmit} className='app-card p-4 space-y-3'>
        <div className='flex flex-col'>
          <label className='text-sm'>Crew ID</label>
          <input className='bg-[--muted] px-3 py-2 rounded' value={crewId} onChange={(e) => setCrewId(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm'>Offered Flight ID</label>
          <input type='number' className='bg-[--muted] px-3 py-2 rounded' value={offeredFlightId} onChange={(e) => setOfferedFlightId(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm'>Requested Flight ID</label>
          <input type='number' className='bg-[--muted] px-3 py-2 rounded' value={requestedFlightId} onChange={(e) => setRequestedFlightId(e.target.value)} required />
        </div>
        <button type='submit' disabled={loading} className='bg-[--brand] px-4 py-2 rounded text-white'>
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </form>
      <div className='app-card p-4 overflow-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th><th>Crew</th><th>Offered Flight</th><th>Requested Flight</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r: any) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.crew_id}</td>
                <td>{r.offered_flight_id}</td>
                <td>{r.requested_flight_id}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

