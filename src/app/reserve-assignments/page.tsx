'use client';

import { useState, useEffect } from 'react';

export default function ReserveAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [crewId, setCrewId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [flightId, setFlightId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAssignments = async () => {
    const res = await fetch('/api/reserve-assignments');
    const data = await res.json();
    setAssignments(data.data || data);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/reserve-assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crewId: Number(crewId),
        startTime,
        endTime,
        flightId: flightId ? Number(flightId) : null,
      }),
    });
    setCrewId('');
    setStartTime('');
    setEndTime('');
    setFlightId('');
    await fetchAssignments();
    setLoading(false);
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-semibold'>Reserve Assignments</h1>
      <form onSubmit={handleSubmit} className='app-card p-4 space-y-3'>
        <div className='flex flex-col'>
          <label className='text-sm'>Crew ID</label>
          <input className='bg-[--muted] px-3 py-2 rounded' value={crewId} onChange={(e) => setCrewId(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm'>Start Time</label>
          <input type='datetime-local' className='bg-[--muted] px-3 py-2 rounded' value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm'>End Time</label>
          <input type='datetime-local' className='bg-[--muted] px-3 py-2 rounded' value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm'>Flight ID (optional)</label>
          <input type='number' className='bg-[--muted] px-3 py-2 rounded' value={flightId} onChange={(e) => setFlightId(e.target.value)} />
        </div>
        <button type='submit' disabled={loading} className='bg-[--brand] px-4 py-2 rounded text-white'>
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </form>
      <div className='app-card p-4 overflow-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th><th>Crew</th><th>Flight</th><th>Start</th><th>End</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a: any) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.crew_id}</td>
                <td>{a.flight_id ?? '-'}</td>
                <td>{a.start_time?.replace('T',' ').slice(0,16)}</td>
                <td>{a.end_time?.replace('T',' ').slice(0,16)}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

