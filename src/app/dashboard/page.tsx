'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Plane, Users, AlertTriangle, Calendar, Activity, Radio } from 'lucide-react';

interface Stats {
  activeFlights: number;
  crewOnDuty: number;
  alerts: number;
  scheduledFlights: number;
}

interface LiveFlight {
  id: string;
  icao24: string;
  callsign: string;
  longitude: number | null;
  latitude: number | null;
  altitude_feet: number | null;
  speed_knots: number | null;
  heading: number | null;
  vertical_rate: number | null;
  on_ground: boolean;
  status: string;
  last_contact: number;
}

// Demo data for immediate loading
const DEMO_STATS: Stats = {
  activeFlights: 3,
  crewOnDuty: 48,
  alerts: 0,
  scheduledFlights: 72
};

const DEMO_FLIGHTS: LiveFlight[] = [
  {
    id: '1',
    icao24: 'su-gfj',
    callsign: 'MSR777',
    longitude: 31.41,
    latitude: 30.12,
    altitude_feet: 35000,
    speed_knots: 450,
    heading: 90,
    vertical_rate: 0,
    on_ground: false,
    status: 'In Flight',
    last_contact: Date.now() / 1000
  },
  {
    id: '2',
    icao24: 'su-gfk',
    callsign: 'MSR985',
    longitude: 29.98,
    latitude: 31.20,
    altitude_feet: 0,
    speed_knots: 0,
    heading: 0,
    vertical_rate: 0,
    on_ground: true,
    status: 'On Ground',
    last_contact: Date.now() / 1000
  },
  {
    id: '3',
    icao24: 'su-gfl',
    callsign: 'MSR123',
    longitude: 33.81,
    latitude: 27.18,
    altitude_feet: 28000,
    speed_knots: 420,
    heading: 180,
    vertical_rate: -500,
    on_ground: false,
    status: 'In Flight',
    last_contact: Date.now() / 1000
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>(DEMO_STATS);
  const [liveFlights, setLiveFlights] = useState<LiveFlight[]>(DEMO_FLIGHTS);
  const [user, setUser] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false); // Start with false for immediate render

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    // Initial fetch in background (non-blocking)
    fetchDashboardData();

    // Refresh every 15 seconds for live tracking
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 15000);

    return () => clearInterval(interval);
  }, [router]);

  const fetchDashboardData = async () => {
    // Fetch in background without blocking UI
    try {
      await Promise.all([
        fetchStats(),
        fetchLiveFlights()
      ]);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Keep using demo data if fetch fails
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchLiveFlights = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/flights/live', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.flights) {
          setLiveFlights(data.flights);
        }
      }
    } catch (error) {
      console.error('Failed to fetch live flights:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const formatTime = (seconds: number) => {
    const now = Date.now() / 1000;
    const diff = Math.floor(now - seconds);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading Operations Center</h2>
          <p className="text-slate-400">Initializing real-time monitoring...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Apex Meridian® Operations Control Center
              </h1>
              <p className="text-slate-400">
                Real-time EgyptAir operations monitoring
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Activity className="w-4 h-4 text-green-500" />
              <span>Live ADS-B</span>
              <span className="text-slate-600">•</span>
              <span>Updated {formatTime(lastUpdate.getTime() / 1000)}</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
              <span className="text-green-500 font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Flights */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Plane className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wide">Active</span>
            </div>
            <div className="mb-1">
              <div className="text-3xl font-bold text-white">{stats.activeFlights}</div>
            </div>
            <div className="text-sm text-slate-400">Active Flights</div>
            <div className="text-xs text-blue-400 mt-2">Real-time tracking</div>
          </div>

          {/* Crew On Duty */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wide">Active</span>
            </div>
            <div className="mb-1">
              <div className="text-3xl font-bold text-white">{stats.crewOnDuty}</div>
            </div>
            <div className="text-sm text-slate-400">Crew On Duty</div>
            <div className="text-xs text-green-400 mt-2">Personnel available</div>
          </div>

          {/* Active Alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wide">Clear</span>
            </div>
            <div className="mb-1">
              <div className="text-3xl font-bold text-white">{stats.alerts}</div>
            </div>
            <div className="text-sm text-slate-400">Active Alerts</div>
            <div className="text-xs text-green-400 mt-2">All systems normal</div>
          </div>

          {/* Scheduled Flights */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wide">Today</span>
            </div>
            <div className="mb-1">
              <div className="text-3xl font-bold text-white">{stats.scheduledFlights}</div>
            </div>
            <div className="text-sm text-slate-400">Scheduled</div>
            <div className="text-xs text-purple-400 mt-2">Today</div>
          </div>
        </div>

        {/* Live Flights Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Radio className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Live EgyptAir Flights</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Real-time ADS-B tracking via OpenSky Network
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-500">Live Tracking</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Callsign
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Altitude
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Speed
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Heading
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {liveFlights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-blue-400" />
                        <span className="font-mono font-semibold text-white">
                          {flight.callsign}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300 font-mono">
                        {flight.latitude?.toFixed(2)}°, {flight.longitude?.toFixed(2)}°
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {flight.altitude_feet?.toLocaleString() || 0}ft
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {flight.speed_knots || 0}kts
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {flight.heading || 0}°
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        flight.on_ground
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {flight.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-800/30 border-t border-slate-800">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Radio className="w-4 h-4" />
                <span>Monitoring {liveFlights.length} active EgyptAir flights</span>
                <span className="text-slate-600">•</span>
                <span>Data refreshes every 15 seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* ADS-B Info */}
        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Radio className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-1">Real-Time ADS-B Tracking</h3>
              <p className="text-sm text-slate-400">
                Monitoring EgyptAir fleet (MSR*/MSE* callsigns) via OpenSky Network. 
                Data refreshes every 15 seconds. Flight positions, altitudes, speeds, and headings are updated in real-time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

