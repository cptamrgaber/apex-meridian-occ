'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Plane, Users, AlertTriangle, Calendar, Activity, Radio, Clock, TrendingUp, MapPin } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  crewOnDuty: 127,
  alerts: 0,
  scheduledFlights: 326
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

  // Hourly operations data
  const hourlyData = [
    { hour: '00:00', flights: 2, onTime: 2, delayed: 0 },
    { hour: '03:00', flights: 5, onTime: 5, delayed: 0 },
    { hour: '06:00', flights: 18, onTime: 16, delayed: 2 },
    { hour: '09:00', flights: 24, onTime: 22, delayed: 2 },
    { hour: '12:00', flights: 28, onTime: 25, delayed: 3 },
    { hour: '15:00', flights: 26, onTime: 24, delayed: 2 },
    { hour: '18:00', flights: 22, onTime: 20, delayed: 2 },
    { hour: '21:00', flights: 15, onTime: 14, delayed: 1 }
  ];

  // Weekly operations data
  const weeklyData = [
    { day: 'Mon', flights: 142, onTime: 128, delayed: 14 },
    { day: 'Tue', flights: 138, onTime: 131, delayed: 7 },
    { day: 'Wed', flights: 145, onTime: 135, delayed: 10 },
    { day: 'Thu', flights: 140, onTime: 133, delayed: 7 },
    { day: 'Fri', flights: 148, onTime: 138, delayed: 10 },
    { day: 'Sat', flights: 135, onTime: 127, delayed: 8 },
    { day: 'Sun', flights: 132, onTime: 125, delayed: 7 }
  ];

  // Delay reasons data
  const delayReasons = [
    { name: 'Weather', value: 35, color: '#3b82f6' },
    { name: 'Technical', value: 25, color: '#ef4444' },
    { name: 'ATC', value: 20, color: '#f59e0b' },
    { name: 'Crew', value: 12, color: '#8b5cf6' },
    { name: 'Other', value: 8, color: '#6b7280' }
  ];

  // On-time performance
  const performanceData = [
    { month: 'Jul', onTime: 89.2 },
    { month: 'Aug', onTime: 91.5 },
    { month: 'Sep', onTime: 88.7 },
    { month: 'Oct', onTime: 92.3 },
    { month: 'Nov', onTime: 90.8 }
  ];

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

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/occ-hero.jpg')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 h-full flex items-center px-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Operations Control Center</h1>
              <p className="text-blue-100 text-lg">Real-time EgyptAir operations monitoring</p>
            </div>
            <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Live ADS-B</span>
              <span className="text-blue-200 text-sm">• {formatTime(lastUpdate.getTime() / 1000)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <Plane className="w-8 h-8 opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.activeFlights}</div>
                  <div className="text-sm opacity-90">Live Tracking</div>
                </div>
              </div>
              <div className="text-sm font-medium">Active Flights</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.crewOnDuty}</div>
                  <div className="text-sm opacity-90">Estimated</div>
                </div>
              </div>
              <div className="text-sm font-medium">Crew On Duty</div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.alerts}</div>
                  <div className="text-sm opacity-90">All Clear</div>
                </div>
              </div>
              <div className="text-sm font-medium">Active Alerts</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.scheduledFlights}</div>
                  <div className="text-sm opacity-90">Today</div>
                </div>
              </div>
              <div className="text-sm font-medium">Scheduled</div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Hourly Operations */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Hourly Operations</h2>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="hour" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Bar dataKey="onTime" fill="#10b981" name="On Time" />
                  <Bar dataKey="delayed" fill="#ef4444" name="Delayed" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Operations */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Weekly Operations</h2>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="flights" stroke="#3b82f6" strokeWidth={2} name="Total Flights" />
                  <Line type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={2} name="On Time" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-3 gap-6">
            {/* Delay Reasons */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-4">Delay Reasons</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={delayReasons}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {delayReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* On-Time Performance */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">On-Time Performance (Last 5 Months)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis domain={[85, 95]} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                    formatter={(value: any) => `${value}%`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="onTime" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ fill: '#10b981', r: 6 }}
                    name="On-Time %" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Flights Table */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Live EgyptAir Flights</h2>
              <span className="ml-auto text-sm text-slate-400">
                Real-Time ADS-B Tracking
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">CALLSIGN</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">POSITION</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">ALTITUDE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">SPEED</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">HEADING</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {liveFlights.map((flight) => (
                    <tr key={flight.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-blue-400 font-semibold">{flight.callsign}</td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-sm">
                        {flight.latitude?.toFixed(2)}°, {flight.longitude?.toFixed(2)}°
                      </td>
                      <td className="py-3 px-4 text-slate-300">{flight.altitude_feet?.toLocaleString() || 0} ft</td>
                      <td className="py-3 px-4 text-slate-300">{flight.speed_knots || 0} kts</td>
                      <td className="py-3 px-4 text-slate-300">{flight.heading || 0}°</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          flight.on_ground 
                            ? 'bg-slate-700 text-slate-300' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {flight.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

