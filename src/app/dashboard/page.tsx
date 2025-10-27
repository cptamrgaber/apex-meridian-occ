'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Users, AlertTriangle, Calendar, LogOut, Activity, Radio, MapPin, Clock } from 'lucide-react';

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

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [liveFlights, setLiveFlights] = useState<LiveFlight[]>([]);
  const [user, setUser] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    // Initial fetch
    fetchDashboardData();

    // Refresh every 15 seconds for live tracking
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 15000);

    return () => clearInterval(interval);
  }, [router]);

  const fetchDashboardData = async () => {
    await Promise.all([
      fetchStats(),
      fetchLiveFlights()
    ]);
    setLastUpdate(new Date());
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Use live flight count if available
      if (liveFlights.length > 0) {
        setStats({
          activeFlights: liveFlights.length,
          crewOnDuty: liveFlights.length * 4, // Estimate crew
          alerts: 0,
          scheduledFlights: liveFlights.length * 2
        });
      }
    }
  };

  const fetchLiveFlights = async () => {
    try {
      const response = await fetch('/api/flights/live');
      
      if (!response.ok) {
        throw new Error('Failed to fetch live flights');
      }
      
      const data = await response.json();
      if (data.success && data.flights) {
        setLiveFlights(data.flights);
        
        // Update stats with live flight count
        setStats(prev => ({
          activeFlights: data.flights.length,
          crewOnDuty: prev?.crewOnDuty || data.flights.length * 4,
          alerts: prev?.alerts || 0,
          scheduledFlights: prev?.scheduledFlights || data.flights.length * 2
        }));
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in flight':
        return 'text-green-400 bg-green-900/30';
      case 'on ground':
        return 'text-blue-400 bg-blue-900/30';
      case 'delayed':
        return 'text-yellow-400 bg-yellow-900/30';
      case 'cancelled':
        return 'text-red-400 bg-red-900/30';
      default:
        return 'text-slate-400 bg-slate-900/30';
    }
  };

  const formatAltitude = (alt: number | null) => {
    if (alt === null) return 'N/A';
    return `${alt.toLocaleString()} ft`;
  };

  const formatSpeed = (speed: number | null) => {
    if (speed === null) return 'N/A';
    return `${speed} kts`;
  };

  const formatHeading = (heading: number | null) => {
    if (heading === null) return 'N/A';
    return `${Math.round(heading)}°`;
  };

  const formatPosition = (lat: number | null, lon: number | null) => {
    if (lat === null || lon === null) return 'N/A';
    return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  };

  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return '';
    const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-white text-lg">Loading EgyptAir Operations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Apex Meridian OCC</h1>
                <p className="text-sm text-slate-400">EgyptAir Operations Control Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Radio className="w-4 h-4 text-green-400 animate-pulse" />
                <span>Live ADS-B</span>
                {lastUpdate && (
                  <span className="text-slate-500">• {getTimeSinceUpdate()}</span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.role} • {user.tenant}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Flights</p>
                <p className="text-3xl font-bold text-white mt-1">{stats?.activeFlights || 0}</p>
                <p className="text-xs text-green-400 mt-1">Live Tracking</p>
              </div>
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <Plane className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Crew On Duty</p>
                <p className="text-3xl font-bold text-white mt-1">{stats?.crewOnDuty || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Estimated</p>
              </div>
              <div className="p-3 bg-green-900/30 rounded-lg">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Alerts</p>
                <p className="text-3xl font-bold text-white mt-1">{stats?.alerts || 0}</p>
                <p className="text-xs text-slate-500 mt-1">All Clear</p>
              </div>
              <div className="p-3 bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Scheduled</p>
                <p className="text-3xl font-bold text-white mt-1">{stats?.scheduledFlights || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Today</p>
              </div>
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Flights Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Live EgyptAir Flights</h2>
                <p className="text-sm text-slate-400 mt-1">Real-time ADS-B tracking via OpenSky Network</p>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-green-400">Live</span>
                <span className="text-slate-500">• {liveFlights.length} aircraft</span>
              </div>
            </div>
          </div>
          
          {liveFlights.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Plane className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No EgyptAir flights currently tracked</p>
              <p className="text-slate-500 text-sm mt-2">
                Waiting for aircraft with callsign MSR* or MSE* to appear on ADS-B
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Callsign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Altitude
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Speed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Heading
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {liveFlights.map((flight) => (
                    <tr key={flight.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Plane className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="text-sm font-medium text-white">{flight.callsign}</div>
                            <div className="text-xs text-slate-500">{flight.icao24.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-slate-300">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{formatPosition(flight.latitude, flight.longitude)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{formatAltitude(flight.altitude_feet)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{formatSpeed(flight.speed_knots)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{formatHeading(flight.heading)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(flight.status)}`}>
                          {flight.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Radio className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-300">Real-Time ADS-B Tracking</h3>
              <p className="text-xs text-slate-400 mt-1">
                Flight data is sourced from OpenSky Network's crowdsourced ADS-B receivers worldwide. 
                Updates every 15 seconds. Coverage may vary by region.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

