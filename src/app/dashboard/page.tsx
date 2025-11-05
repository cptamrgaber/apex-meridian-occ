'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Plane, Users, AlertTriangle, Calendar } from 'lucide-react';
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
    { hour: '00:00', onTime: 2, delayed: 0 },
    { hour: '03:00', onTime: 5, delayed: 0 },
    { hour: '06:00', onTime: 16, delayed: 2 },
    { hour: '09:00', onTime: 22, delayed: 2 },
    { hour: '12:00', onTime: 25, delayed: 3 },
    { hour: '15:00', onTime: 24, delayed: 2 },
    { hour: '18:00', onTime: 20, delayed: 2 },
    { hour: '21:00', onTime: 12, delayed: 1 },
  ];

  // Weekly operations data
  const weeklyData = [
    { day: 'Mon', flights: 52 },
    { day: 'Tue', flights: 48 },
    { day: 'Wed', flights: 55 },
    { day: 'Thu', flights: 51 },
    { day: 'Fri', flights: 58 },
    { day: 'Sat', flights: 62 },
    { day: 'Sun', flights: 45 },
  ];

  // Delay reasons data
  const delayData = [
    { name: 'Weather', value: 35 },
    { name: 'Technical', value: 25 },
    { name: 'Crew', value: 12 },
    { name: 'Other', value: 8 },
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'];

  // On-time performance data
  const performanceData = [
    { month: 'Jun', performance: 85 },
    { month: 'Jul', performance: 88 },
    { month: 'Aug', performance: 82 },
    { month: 'Sep', performance: 90 },
    { month: 'Oct', performance: 87 },
  ];

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch live flight data
    const fetchLiveFlights = async () => {
      try {
        const response = await fetch('/api/flights/live');
        if (response.ok) {
          const data = await response.json();
          if (data.flights && data.flights.length > 0) {
            setLiveFlights(data.flights);
            setStats(prev => ({ ...prev, activeFlights: data.flights.length }));
          }
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Error fetching live flights:', error);
      }
    };

    fetchLiveFlights();
    const interval = setInterval(fetchLiveFlights, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Operations Control
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Real-time EgyptAir monitoring
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Active Flights */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.activeFlights}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Active Flights
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                Live Tracking
              </div>
            </div>

            {/* Crew On Duty */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.crewOnDuty}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Crew On Duty
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                Estimated
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.alerts}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Active Alerts
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                All Clear
              </div>
            </div>

            {/* Scheduled Today */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.scheduledFlights}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Scheduled Today
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                All Clear
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Hourly Operations */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Hourly Operations
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="hour" className="text-slate-600 dark:text-slate-400" />
                  <YAxis className="text-slate-600 dark:text-slate-400" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)' }} />
                  <Legend />
                  <Bar dataKey="delayed" fill="#ef4444" name="Delayed" />
                  <Bar dataKey="onTime" fill="#10b981" name="On Time" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Operations */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Weekly Operations
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="day" className="text-slate-600 dark:text-slate-400" />
                  <YAxis className="text-slate-600 dark:text-slate-400" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="flights" stroke="#3b82f6" strokeWidth={2} name="Total Flights" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Delay Reasons */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Delay Reasons
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={delayData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => entry.name}
                  >
                    {delayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* On-Time Performance */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                On-Time Performance (Last 5 Months)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="month" className="text-slate-600 dark:text-slate-400" />
                  <YAxis className="text-slate-600 dark:text-slate-400" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={2} name="On-Time %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Flights Table */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Live EgyptAir Flights
              </h2>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Callsign</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Registration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Altitude</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Speed</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {liveFlights.map((flight) => (
                    <tr key={flight.id} className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-3 px-4 text-sm text-slate-900 dark:text-white font-medium">
                        {flight.callsign}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {flight.icao24.toUpperCase()}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {flight.altitude_feet ? `${flight.altitude_feet.toLocaleString()} ft` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {flight.speed_knots ? `${flight.speed_knots} kts` : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          flight.on_ground
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
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

      <MobileBottomNav />
    </div>
  );
}

