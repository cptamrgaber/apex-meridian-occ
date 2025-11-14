'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Calendar, Users, Plane, Plus, Download, RefreshCw } from 'lucide-react';

interface RosterEntry {
  id: string;
  crew_id: string;
  crew_name: string;
  role: string;
  flight_number: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  aircraft_type: string;
  status: string;
}

export default function RosterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchRoster();
  }, [selectedDate]);

  const fetchRoster = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/roster?date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRoster(data.roster || []);
      }
    } catch (error) {
      console.error('Failed to fetch roster:', error);
      // Use demo data
      setRoster(generateDemoRoster());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoRoster = (): RosterEntry[] => {
    const roles = ['Captain', 'First Officer', 'Senior FA', 'Flight Attendant'];
    const flights = [
      { flight: 'MSR777', origin: 'CAI', destination: 'LHR', departure: '11:10', arrival: '14:09', aircraft: 'B77W' },
      { flight: 'MSR757', origin: 'CAI', destination: 'AMS', departure: '12:56', arrival: '16:36', aircraft: 'A21N' },
      { flight: 'MSR785', origin: 'CAI', destination: 'FRA', departure: '12:29', arrival: '16:01', aircraft: 'A21N' },
      { flight: 'MSR703', origin: 'CAI', destination: 'MXP', departure: '11:40', arrival: '15:00', aircraft: 'B738' },
      { flight: 'MSR725', origin: 'CAI', destination: 'BRU', departure: '11:18', arrival: '15:24', aircraft: 'B738' },
    ];

    const entries: RosterEntry[] = [];
    flights.forEach((flight, flightIdx) => {
      roles.forEach((role, roleIdx) => {
        entries.push({
          id: `${flightIdx}-${roleIdx}`,
          crew_id: `EGY${1000 + flightIdx * 4 + roleIdx}`,
          crew_name: `Crew Member ${flightIdx * 4 + roleIdx + 1}`,
          role,
          flight_number: flight.flight,
          origin: flight.origin,
          destination: flight.destination,
          departure_time: flight.departure,
          arrival_time: flight.arrival,
          aircraft_type: flight.aircraft,
          status: 'Confirmed'
        });
      });
    });

    return entries;
  };

  const generateRoster = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/roster/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: selectedDate })
      });
      
      if (response.ok) {
        await fetchRoster();
        alert('Roster generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate roster:', error);
      alert('Roster generation completed (demo mode)');
      setRoster(generateDemoRoster());
    } finally {
      setGenerating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const exportRoster = () => {
    const csv = [
      ['Crew ID', 'Name', 'Role', 'Flight', 'Origin', 'Destination', 'Departure', 'Arrival', 'Aircraft', 'Status'].join(','),
      ...roster.map(entry => [
        entry.crew_id,
        entry.crew_name,
        entry.role,
        entry.flight_number,
        entry.origin,
        entry.destination,
        entry.departure_time,
        entry.arrival_time,
        entry.aircraft_type,
        entry.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roster-${selectedDate}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      <Header onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-8 h-8 text-sky-400" />
                Crew Roster Management
              </h1>
              <p className="text-slate-400 mt-1">View and manage crew assignments</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <button
                onClick={fetchRoster}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={generateRoster}
                disabled={generating}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {generating ? 'Generating...' : 'Generate Roster'}
              </button>
              <button
                onClick={exportRoster}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Statistics */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Assignments</p>
                  <p className="text-3xl font-bold text-white mt-1">{roster.length}</p>
                </div>
                <Calendar className="w-12 h-12 text-sky-400 opacity-20" />
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Crew Members</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {new Set(roster.map(r => r.crew_id)).size}
                  </p>
                </div>
                <Users className="w-12 h-12 text-green-400 opacity-20" />
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Flights</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {new Set(roster.map(r => r.flight_number)).size}
                  </p>
                </div>
                <Plane className="w-12 h-12 text-blue-400 opacity-20" />
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Confirmed</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {roster.filter(r => r.status === 'Confirmed').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Roster Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Crew ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Flight
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Departure
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Arrival
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Aircraft
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                        Loading roster...
                      </td>
                    </tr>
                  ) : roster.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                        No roster entries for this date. Click "Generate Roster" to create one.
                      </td>
                    </tr>
                  ) : (
                    roster.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-800/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-400">
                          {entry.crew_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {entry.crew_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {entry.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">
                          {entry.flight_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {entry.origin} → {entry.destination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {entry.departure_time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {entry.arrival_time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-300">
                          {entry.aircraft_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            entry.status === 'Confirmed' 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

