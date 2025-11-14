'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Aircraft {
  registration: string;
  type: string;
  manufacturer: string;
  deliveryDate: string;
  status: string;
  age: number;
  totalFlightHours: number;
  cycles: number;
  nextMaintenance: string;
}

export default function FleetManagement() {
  const router = useRouter();
  const [fleet, setFleet] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchFleet();
  }, [router]);

  const fetchFleet = async () => {
    try {
      const response = await fetch('/api/fleet');
      const data = await response.json();
      
      // Enhance with additional details
      const enhancedFleet = data.aircraft.map((ac: any) => {
        const deliveryYear = ac.deliveryDate ? parseInt(ac.deliveryDate.split('-')[0]) : 2015;
        const age = new Date().getFullYear() - deliveryYear;
        
        return {
          ...ac,
          age,
          totalFlightHours: 15000 + Math.floor(Math.random() * 35000),
          cycles: 8000 + Math.floor(Math.random() * 20000),
          nextMaintenance: `${Math.floor(Math.random() * 30) + 1} days`,
          status: Math.random() > 0.1 ? 'Active' : 'Maintenance'
        };
      });

      setFleet(enhancedFleet);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fleet:', error);
      setLoading(false);
    }
  };

  const filteredFleet = filter === 'all'
    ? fleet
    : fleet.filter(ac => ac.type.includes(filter));

  const aircraftTypes = [...new Set(fleet.map(ac => ac.type))];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-950">
        <Header onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-400">Loading fleet data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Header onLogout={handleLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Fleet Management</h1>
            <p className="text-slate-400">EgyptAir aircraft fleet overview and maintenance tracking</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">Total Aircraft</div>
              <div className="text-3xl font-bold text-white">{fleet.length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">Active</div>
              <div className="text-3xl font-bold text-green-400">
                {fleet.filter(ac => ac.status === 'Active').length}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">In Maintenance</div>
              <div className="text-3xl font-bold text-yellow-400">
                {fleet.filter(ac => ac.status === 'Maintenance').length}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">Avg Age</div>
              <div className="text-3xl font-bold text-blue-400">
                {Math.round(fleet.reduce((sum, ac) => sum + ac.age, 0) / fleet.length)} yrs
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              All Aircraft
            </button>
            {aircraftTypes.slice(0, 6).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg ${
                  filter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Fleet Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Registration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Manufacturer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Age</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Flight Hours</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Cycles</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Next Maintenance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFleet.map((aircraft) => (
                    <tr key={aircraft.registration} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-6 py-4 text-sm font-medium text-white">{aircraft.registration}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{aircraft.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{aircraft.manufacturer}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{aircraft.age} years</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          aircraft.status === 'Active'
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {aircraft.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {aircraft.totalFlightHours.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {aircraft.cycles.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{aircraft.nextMaintenance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-6 text-sm text-slate-400">
            Showing {filteredFleet.length} of {fleet.length} aircraft
          </div>
        </div>
      </div>
    </div>
  );
}

