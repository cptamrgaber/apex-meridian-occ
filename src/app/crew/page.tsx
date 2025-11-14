'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Captain {
  id: string;
  code: string;
  english_name: string;
  passport_name: string;
  arabic_name: string;
  aircraft_type: string;
  base: string;
  status: string;
  license: string;
  seniority: number;
  joining_date: string;
}

export default function CrewManagement() {
  const router = useRouter();
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchCaptains();
  }, [router, filter, search]);

  const fetchCaptains = async () => {
    try {
      const params = new URLSearchParams({
        limit: '100',
        offset: '0',
      });
      
      if (filter !== 'all') {
        params.append('aircraft_type', filter);
      }
      
      if (search) {
        params.append('search', search);
      }

      const res = await fetch(`/api/captains?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setCaptains(data.captains);
        setStats(data.statistics);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching captains:', error);
      setLoading(false);
    }
  };

  const aircraftTypes = stats?.aircraft_types ? Object.keys(stats.aircraft_types).sort() : [];

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-950">
        <Header onLogout={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-400">Loading EgyptAir captains data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Header onLogout={() => {
        localStorage.removeItem('token');
        router.push('/login');
      }} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">EgyptAir Captains</h1>
            <p className="text-slate-400">Real EgyptAir captain database with {stats?.total_captains || 0} active pilots</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">Total Captains</div>
              <div className="text-3xl font-bold text-white">{stats?.total_captains || 0}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">B737-800</div>
              <div className="text-3xl font-bold text-blue-400">
                {stats?.aircraft_types?.['800'] || 0}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">A330-300</div>
              <div className="text-3xl font-bold text-green-400">
                {stats?.aircraft_types?.['A330-300'] || 0}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="text-slate-400 text-sm mb-2">B787-9</div>
              <div className="text-3xl font-bold text-purple-400">
                {stats?.aircraft_types?.['B787-9'] || 0}
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                All ({stats?.total_captains || 0})
              </button>
              {aircraftTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type} ({stats?.aircraft_types[type] || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Captains Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name (English)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name (Arabic)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Aircraft Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">License</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Base</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Seniority</th>
                  </tr>
                </thead>
                <tbody>
                  {captains.map((captain) => (
                    <tr key={captain.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono">{captain.code}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white">{captain.passport_name || captain.english_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-300" dir="rtl">{captain.arabic_name}</td>
                      <td className="px-6 py-4 text-sm text-blue-400">{captain.aircraft_type}</td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono">{captain.license}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{captain.base}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-400">
                          {captain.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{captain.seniority.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-6 text-sm text-slate-400">
            Showing {captains.length} captains
            {filter !== 'all' && ` (filtered by ${filter})`}
            {search && ` (search: "${search}")`}
          </div>
        </div>
      </div>
    </div>
  );
}

