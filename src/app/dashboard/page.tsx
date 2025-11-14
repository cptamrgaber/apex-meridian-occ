"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';
import { Plane, Users, AlertTriangle, Calendar, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeFlights: 3,
    crewOnDuty: 127,
    alerts: 0,
    scheduledFlights: 326
  });

  const [liveFlights, setLiveFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real live flights data
  useEffect(() => {
    const fetchLiveFlights = async () => {
      try {
        const response = await fetch('/api/live-flights?count=5');
        const data = await response.json();
        if (data.success && data.flights) {
          setLiveFlights(data.flights);
          setStats(prev => ({
            ...prev,
            activeFlights: data.flights.length
          }));
        }
      } catch (error) {
        console.error('Error fetching live flights:', error);
        // Fallback to mock data
        setLiveFlights([
          { callsign: 'MS777', origin: 'CAI', destination: 'LHR', altitude: 35000, speed: 450, status: 'In Flight' },
          { callsign: 'MS985', origin: 'CAI', destination: 'JFK', altitude: 38000, speed: 480, status: 'In Flight' },
          { callsign: 'MS961', origin: 'CAI', destination: 'CDG', altitude: 32000, speed: 420, status: 'In Flight' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveFlights();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLiveFlights, 30000);
    return () => clearInterval(interval);
  }, []);

  // Hourly operations data
  const hourlyData = [
    { hour: '00:00', delayed: 1, onTime: 3, total: 17 },
    { hour: '03:00', delayed: 2, onTime: 4, total: 19 },
    { hour: '06:00', delayed: 3, onTime: 12, total: 24 },
    { hour: '09:00', delayed: 2, onTime: 22, total: 28 },
    { hour: '12:00', delayed: 4, onTime: 22, total: 31 },
    { hour: '15:00', delayed: 2, onTime: 23, total: 29 },
    { hour: '18:00', delayed: 3, onTime: 17, total: 24 },
    { hour: '21:00', delayed: 1, onTime: 13, total: 18 },
  ];

  // Delay reasons data
  const delayData = [
    { name: 'Weather', value: 35, color: '#3b82f6' },
    { name: 'Technical', value: 25, color: '#8b5cf6' },
    { name: 'Crew', value: 12, color: '#10b981' },
    { name: 'Other', value: 8, color: '#f59e0b' },
  ];

  // Weekly operations trend
  const weeklyData = [
    { day: 'Mon', flights: 42, onTime: 38 },
    { day: 'Tue', flights: 45, onTime: 41 },
    { day: 'Wed', flights: 48, onTime: 44 },
    { day: 'Thu', flights: 46, onTime: 42 },
    { day: 'Fri', flights: 50, onTime: 45 },
    { day: 'Sat', flights: 38, onTime: 36 },
    { day: 'Sun', flights: 35, onTime: 33 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      
      <main className="pt-16 w-full mobile-page-content">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  Operations Control
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Real-time EgyptAir Monitoring
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Welcome to EgyptAir Operations Control Center</h2>
            <p className="text-xs md:text-sm text-gray-700">
              This dashboard provides real-time monitoring of all EgyptAir flight operations. Track active flights, crew availability, 
              operational alerts, and performance metrics. Use the sidebar to navigate to specific modules for detailed management.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Current Operations Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Active Flights */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div className="stat-number text-gray-900">{stats.activeFlights}</div>
              <div className="stat-label text-gray-600">Active Flights</div>
              <div className="text-xs text-blue-600 mt-2 font-medium">Live Tracking</div>
            </div>

            {/* Crew On Duty */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="stat-number text-gray-900">{stats.crewOnDuty}</div>
              <div className="stat-label text-gray-600">Crew On Duty</div>
              <div className="text-xs text-green-600 mt-2 font-medium">All Available</div>
            </div>

            {/* Active Alerts */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                {stats.alerts === 0 && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
              </div>
              <div className="stat-number text-gray-900">{stats.alerts}</div>
              <div className="stat-label text-gray-600">Active Alerts</div>
              <div className="text-xs text-green-600 mt-2 font-medium">All Clear</div>
            </div>

            {/* Scheduled Today */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="stat-number text-gray-900">{stats.scheduledFlights}</div>
              <div className="stat-label text-gray-600">Scheduled Today</div>
              <div className="text-xs text-purple-600 mt-2 font-medium">On Track</div>
            </div>
          </div>

          {/* Charts Section */}
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 mt-6 md:mt-8">Performance Analytics</h3>
          <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">Detailed analysis of flight operations, delays, and performance trends.</p>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Hourly Operations */}
            <div className="clean-card p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Hourly Operations
                </h2>
                <p className="text-sm text-gray-600">
                  Flight operations throughout the day, showing on-time vs delayed flights for each 3-hour period.
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="delayed" fill="#f59e0b" name="Delayed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="onTime" fill="#10b981" name="On Time" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Operations */}
            <div className="clean-card p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Weekly Operations
                </h2>
                <p className="text-sm text-gray-600">
                  7-day trend showing total scheduled flights and on-time performance across the week.
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="flights" stroke="#3b82f6" strokeWidth={3} name="Total Flights" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={3} name="On Time" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Delay Reasons */}
            <div className="clean-card p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Delay Reasons
                </h2>
                <p className="text-sm text-gray-600">
                  Breakdown of flight delays by cause: weather conditions, technical issues, crew availability, and other factors.
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={delayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {delayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Live Flights Table */}
            <div className="clean-card p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Live EgyptAir Flights
                </h2>
                <p className="text-sm text-gray-600">
                  Real-time tracking of active flights currently in the air, showing flight number, route, altitude, and speed.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Flight</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Route</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Altitude</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Speed</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveFlights.map((flight, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-gray-900">{flight.callsign}</td>
                        <td className="py-3 px-4 text-gray-600">
                          <span className="font-medium">{flight.origin}</span>
                          <span className="mx-1">→</span>
                          <span className="font-medium">{flight.destination}</span>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">{flight.altitude.toLocaleString()} ft</td>
                        <td className="py-3 px-4 text-right text-gray-600">{flight.speed} kts</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-2 text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
        </div>

        <Footer />
        <MobileBottomNav />
      </main>
    </div>
  );
}

