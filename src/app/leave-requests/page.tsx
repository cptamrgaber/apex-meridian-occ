'use client';

import { useState, useEffect } from 'react';

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [crewId, setCrewId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    const res = await fetch('/api/leave-requests');
    const data = await res.json();
    setRequests(data.data || data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/leave-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crewId: Number(crewId),
        startDate,
        endDate,
        type,
        notes,
      }),
    });
    setCrewId('');
    setStartDate('');
    setEndDate('');
    setType('');
    setNotes('');
    await fetchRequests();
    setLoading(false);
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-semibold'>Leave Requests</h1>
      <form onSubmit={handleSubmit} className='app-card p-4 space-y-3'>
        <div className='flex flex-col'>
          <label className='text-sm'>Crew ID</label>
          <input className='bg-[--muted] px-3 py-2 rounded' value={crewId} onChange={(e) => setCrewId(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm'>Type</label>
          <input className='bg-[--muted] px-3 py-2 rounded' value={type} onChange={(e) => setType(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm'>Start Date</label>
          <input type='date' className='bg-[--muted] px-3 py-2 rounded' value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm'>End Date</label>
          <input type='date' className='bg-[--muted] px-3 py-2 rounded' value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm'>Notes</label>
          <textarea className='bg-[--muted] px-3 py-2 rounded' value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <button type='submit' disabled={loading} className='bg-[--brand] px-4 py-2 rounded text-white'>
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </form>
      <div className='app-card p-4 overflow-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th><th>Crew</th><th>Type</th><th>Start</th><th>End</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r: any) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.crew_id}</td>
                <td>{r.type}</td>
                <td>{r.start_date?.slice(0, 10)}</td>
                <td>{r.end_date?.slice(0, 10)}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

