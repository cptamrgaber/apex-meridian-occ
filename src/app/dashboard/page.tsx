'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Users, AlertTriangle, Calendar, LogOut, Activity } from 'lucide-react';

interface Stats {
  activeFlights: number;
  crewOnDuty: number;
  alerts: number;
  scheduledFlights: number;
}

interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  status: string;
  aircraft: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    // Fetch dashboard data
    fetchStats();
    fetchFlights();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchFlights();
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchFlights = async () => {
    try {
      const response = await fetch('/api/flights');
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Failed to fetch flights:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on time':
        return 'text-green-400 bg-green-900/30';
      case 'delayed':
        return 'text-yellow-400 bg-yellow-900/30';
      case 'cancelled':
        return 'text-red-400 bg-red-900/30';
      default:
        return 'text-blue-400 bg-blue-900/30';
    }
  };

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
                <p className="text-sm text-slate-400">Operations Control Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
                <p className="text-3xl font-bold text-white mt-1">{stats.activeFlights}</p>
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
                <p className="text-3xl font-bold text-white mt-1">{stats.crewOnDuty}</p>
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
                <p className="text-3xl font-bold text-white mt-1">{stats.alerts}</p>
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
                <p className="text-3xl font-bold text-white mt-1">{stats.scheduledFlights}</p>
              </div>
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Flights Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Active Flights</h2>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Activity className="w-4 h-4" />
                <span>Live</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Flight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Departure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Arrival
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Aircraft
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {flights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{flight.flightNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">
                        {flight.origin} → {flight.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">
                        {new Date(flight.departure).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">
                        {new Date(flight.arrival).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{flight.aircraft}</div>
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
        </div>
      </main>
    </div>
  );
}

