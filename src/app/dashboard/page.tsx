'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Plane, Users, AlertTriangle, Calendar, Activity, Radio, MapPin, Clock } from 'lucide-react';

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
  const [demoMode, setDemoMode] = useState(false);

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
      if (liveFlights.length > 0) {
        setStats({
          activeFlights: liveFlights.length,
          crewOnDuty: liveFlights.length * 4,
          alerts: 0,
          scheduledFlights: liveFlights.length * 2
        });
      }
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
      
      if (!response.ok) {
        throw new Error('Failed to fetch live flights');
      }
      
      const data = await response.json();
      if (data.success && data.flights) {
        setLiveFlights(data.flights);
        setDemoMode(data.demo_mode || false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Plane className="w-16 h-16 text-sky-400 animate-pulse mx-auto mb-4" />
          <p className="text-xl text-white">Loading EgyptAir Operations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Radio className="w-8 h-8 text-sky-400" />
                Operations Control Center
              </h1>
              <p className="text-slate-400 mt-1">Real-time EgyptAir operations monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                demoMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
              }`}>
                <Activity className="w-4 h-4" />
                <span className="font-medium">{demoMode ? 'Demo Mode' : 'Live ADS-B'}</span>
                {lastUpdate && (
                  <span className="text-sm opacity-75">
                    • {Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s ago
                  </span>
                )}
              </div>
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
                  <p className="text-slate-400 text-sm">Active Flights</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.activeFlights || 0}</p>
                  <p className="text-xs text-sky-400 mt-1">Live Tracking</p>
                </div>
                <Plane className="w-12 h-12 text-sky-400 opacity-20" />
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Crew On Duty</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.crewOnDuty || 0}</p>
                  <p className="text-xs text-green-400 mt-1">Estimated</p>
                </div>
                <Users className="w-12 h-12 text-green-400 opacity-20" />
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Alerts</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.alerts || 0}</p>
                  <p className="text-xs text-slate-400 mt-1">All Clear</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-yellow-400 opacity-20" />
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Scheduled</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.scheduledFlights || 0}</p>
                  <p className="text-xs text-blue-400 mt-1">Today</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-400 opacity-20" />
              </div>
            </div>
          </div>

          {/* Live Flights Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-sky-400" />
                Live EgyptAir Flights
              </h2>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
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
                <tbody className="divide-y divide-slate-800">
                  {liveFlights.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        No live flights detected. Waiting for EgyptAir aircraft...
                      </td>
                    </tr>
                  ) : (
                    liveFlights.map((flight) => (
                      <tr key={flight.id} className="hover:bg-slate-800/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-sky-400">
                          {flight.callsign}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {flight.latitude?.toFixed(2)}°, {flight.longitude?.toFixed(2)}°
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {flight.altitude_feet?.toLocaleString() || 0} ft
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {flight.speed_knots?.toFixed(0) || 0} kts
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {flight.heading?.toFixed(0) || 0}°
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            flight.on_ground 
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {flight.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-sky-500/10 border border-sky-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Radio className="w-5 h-5 text-sky-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-sky-400">Real-Time ADS-B Tracking</p>
                <p className="text-sm text-slate-300 mt-1">
                  Monitoring EgyptAir fleet (MSR*/MSE* callsigns) via OpenSky Network. 
                  Data refreshes every 15 seconds. {demoMode && 'Currently showing demo data.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
