"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';
import { Plane, Users, AlertTriangle, Calendar, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeFlights: 3,
    crewOnDuty: 127,
    alerts: 0,
    scheduledFlights: 326
  });

  const [liveFlights, setLiveFlights] = useState([
    { callsign: 'MSR777', origin: 'CAI', destination: 'JFK', altitude: 35000, speed: 450, status: 'In Flight' },
    { callsign: 'MSR985', origin: 'CAI', destination: 'LHR', altitude: 38000, speed: 480, status: 'In Flight' },
    { callsign: 'MSR612', origin: 'CAI', destination: 'DXB', altitude: 32000, speed: 420, status: 'In Flight' },
  ]);

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
    { name: 'Weather', value: 35, color: '#06b6d4' },
    { name: 'Technical', value: 25, color: '#3b82f6' },
    { name: 'Crew', value: 12, color: '#22c55e' },
    { name: 'Other', value: 8, color: '#a855f7' },
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
    <div className="min-h-screen flex grid-pattern">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 md:ml-64 mobile-page-content">
        {/* Header */}
        <div className="border-b border-cyan-500/30 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold neon-glow uppercase tracking-wider mb-1">
                  Operations Control
                </h1>
                <p className="text-sm text-cyan-400 uppercase tracking-widest">
                  Real-time EgyptAir Monitoring
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="status-indicator"></div>
                <span className="text-sm text-cyan-400 uppercase tracking-wider">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Active Flights */}
            <div className="command-card neon-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-500/10 rounded border border-cyan-500/30">
                  <Plane className="w-6 h-6 text-cyan-400" />
                </div>
                <Activity className="w-5 h-5 text-cyan-500 animate-pulse" />
              </div>
              <div className="text-stat-number text-cyan-400 mb-2">{stats.activeFlights}</div>
              <div className="text-sm text-cyan-300 uppercase tracking-wider">Active Flights</div>
              <div className="text-xs text-cyan-600 mt-1">Live Tracking</div>
            </div>

            {/* Crew On Duty */}
            <div className="command-card neon-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div className="status-indicator"></div>
              </div>
              <div className="text-stat-number text-green-400 mb-2">{stats.crewOnDuty}</div>
              <div className="text-sm text-green-300 uppercase tracking-wider">Crew On Duty</div>
              <div className="text-xs text-green-600 mt-1">Estimated</div>
            </div>

            {/* Active Alerts */}
            <div className="command-card neon-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded border border-orange-500/30">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                {stats.alerts === 0 && <div className="status-indicator"></div>}
              </div>
              <div className="text-stat-number text-orange-400 mb-2">{stats.alerts}</div>
              <div className="text-sm text-orange-300 uppercase tracking-wider">Active Alerts</div>
              <div className="text-xs text-orange-600 mt-1">All Clear</div>
            </div>

            {/* Scheduled Today */}
            <div className="command-card neon-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
                <div className="status-indicator"></div>
              </div>
              <div className="text-stat-number text-purple-400 mb-2">{stats.scheduledFlights}</div>
              <div className="text-sm text-purple-300 uppercase tracking-wider">Scheduled Today</div>
              <div className="text-xs text-purple-600 mt-1">All Clear</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Hourly Operations */}
            <div className="command-card neon-border p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Hourly Operations
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#06b6d4" opacity={0.1} />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#06b6d4" 
                    style={{ fontSize: '12px', fontFamily: 'Share Tech Mono, monospace' }}
                  />
                  <YAxis 
                    stroke="#06b6d4"
                    style={{ fontSize: '12px', fontFamily: 'Share Tech Mono, monospace' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      border: '1px solid #06b6d4',
                      borderRadius: '2px',
                      fontFamily: 'Share Tech Mono, monospace'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="delayed" fill="#fb923c" name="Delayed" />
                  <Bar dataKey="onTime" fill="#22c55e" name="On Time" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Operations */}
            <div className="command-card neon-border p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Weekly Operations
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#06b6d4" opacity={0.1} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#06b6d4"
                    style={{ fontSize: '12px', fontFamily: 'Share Tech Mono, monospace' }}
                  />
                  <YAxis 
                    stroke="#06b6d4"
                    style={{ fontSize: '12px', fontFamily: 'Share Tech Mono, monospace' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      border: '1px solid #06b6d4',
                      borderRadius: '2px',
                      fontFamily: 'Share Tech Mono, monospace'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '12px'
                    }}
                  />
                  <Line type="monotone" dataKey="flights" stroke="#06b6d4" strokeWidth={2} name="Total Flights" />
                  <Line type="monotone" dataKey="onTime" stroke="#22c55e" strokeWidth={2} name="On Time" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Delay Reasons */}
            <div className="command-card neon-border p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4 uppercase tracking-wider">
                Delay Reasons
              </h2>
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
                      backgroundColor: '#0a0a0a', 
                      border: '1px solid #06b6d4',
                      borderRadius: '2px',
                      fontFamily: 'Share Tech Mono, monospace'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Live Flights Table */}
            <div className="command-card neon-border p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Live EgyptAir Flights
              </h2>
              <div className="space-y-3">
                {liveFlights.map((flight, index) => (
                  <div key={index} className="border border-cyan-900 p-3 rounded hover:border-cyan-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-cyan-300 font-bold">{flight.callsign}</span>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded uppercase">
                        {flight.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-cyan-500 font-mono">
                      <div>{flight.origin} → {flight.destination}</div>
                      <div className="text-right">{flight.altitude.toLocaleString()} ft</div>
                      <div>{flight.speed} kts</div>
                      <div className="text-right flex items-center justify-end gap-1">
                        <div className="status-indicator"></div>
                        Tracking
                      </div>
                    </div>
                  </div>
                ))}
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

