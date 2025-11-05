'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { BarChart3, TrendingUp, Clock, Calendar, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'hourly' | 'quarter' | 'weekly' | 'monthly' | 'annual'>('hourly');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Hourly data (24 hours)
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    flights: Math.floor(Math.random() * 20) + 5,
    onTime: Math.floor(Math.random() * 18) + 4,
    delayed: Math.floor(Math.random() * 3),
    cancelled: Math.floor(Math.random() * 2)
  }));

  // Quarter-daily data (96 quarters - 15 min intervals)
  const quarterData = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const quarter = (i % 4) * 15;
    return {
      time: `${hour.toString().padStart(2, '0')}:${quarter.toString().padStart(2, '0')}`,
      flights: Math.floor(Math.random() * 5) + 1,
      onTime: Math.floor(Math.random() * 4) + 1,
      delayed: Math.floor(Math.random() * 2)
    };
  });

  // Weekly data (7 days)
  const weeklyData = [
    { day: 'Monday', flights: 142, onTime: 128, delayed: 12, cancelled: 2, onTimePercent: 90.1 },
    { day: 'Tuesday', flights: 138, onTime: 131, delayed: 6, cancelled: 1, onTimePercent: 94.9 },
    { day: 'Wednesday', flights: 145, onTime: 135, delayed: 9, cancelled: 1, onTimePercent: 93.1 },
    { day: 'Thursday', flights: 140, onTime: 133, delayed: 6, cancelled: 1, onTimePercent: 95.0 },
    { day: 'Friday', flights: 148, onTime: 138, delayed: 9, cancelled: 1, onTimePercent: 93.2 },
    { day: 'Saturday', flights: 135, onTime: 127, delayed: 7, cancelled: 1, onTimePercent: 94.1 },
    { day: 'Sunday', flights: 132, onTime: 125, delayed: 6, cancelled: 1, onTimePercent: 94.7 }
  ];

  // Monthly data (12 months)
  const monthlyData = [
    { month: 'Jan', flights: 4250, onTime: 3825, delayed: 380, cancelled: 45, onTimePercent: 90.0 },
    { month: 'Feb', flights: 3950, onTime: 3595, delayed: 320, cancelled: 35, onTimePercent: 91.0 },
    { month: 'Mar', flights: 4380, onTime: 3986, delayed: 360, cancelled: 34, onTimePercent: 91.0 },
    { month: 'Apr', flights: 4220, onTime: 3882, delayed: 310, cancelled: 28, onTimePercent: 92.0 },
    { month: 'May', flights: 4450, onTime: 4095, delayed: 325, cancelled: 30, onTimePercent: 92.0 },
    { month: 'Jun', flights: 4680, onTime: 4305, delayed: 345, cancelled: 30, onTimePercent: 92.0 },
    { month: 'Jul', flights: 4920, onTime: 4387, delayed: 495, cancelled: 38, onTimePercent: 89.2 },
    { month: 'Aug', flights: 4850, onTime: 4438, delayed: 380, cancelled: 32, onTimePercent: 91.5 },
    { month: 'Sep', flights: 4580, onTime: 4062, delayed: 480, cancelled: 38, onTimePercent: 88.7 },
    { month: 'Oct', flights: 4420, onTime: 4080, delayed: 310, cancelled: 30, onTimePercent: 92.3 },
    { month: 'Nov', flights: 4280, onTime: 3886, delayed: 365, cancelled: 29, onTimePercent: 90.8 },
    { month: 'Dec', flights: 4350, onTime: 3915, delayed: 405, cancelled: 30, onTimePercent: 90.0 }
  ];

  // Annual data (5 years)
  const annualData = [
    { year: '2021', flights: 45280, onTime: 40752, delayed: 4073, cancelled: 455, onTimePercent: 90.0 },
    { year: '2022', flights: 48650, onTime: 44347, delayed: 3892, cancelled: 411, onTimePercent: 91.2 },
    { year: '2023', flights: 51230, onTime: 47138, delayed: 3586, cancelled: 506, onTimePercent: 92.0 },
    { year: '2024', flights: 53420, onTime: 49256, delayed: 3738, cancelled: 426, onTimePercent: 92.2 },
    { year: '2025', flights: 52380, onTime: 47572, delayed: 4450, cancelled: 358, onTimePercent: 90.8 }
  ];

  // Delay reasons
  const delayReasons = [
    { name: 'Weather', value: 35, color: '#3b82f6' },
    { name: 'Technical', value: 25, color: '#ef4444' },
    { name: 'ATC', value: 20, color: '#f59e0b' },
    { name: 'Crew', value: 12, color: '#8b5cf6' },
    { name: 'Other', value: 8, color: '#6b7280' }
  ];

  // Regulatory compliance indicators
  const complianceData = [
    { metric: 'Flight Time Limits', compliance: 98.5, status: 'excellent' },
    { metric: 'Rest Period Compliance', compliance: 99.2, status: 'excellent' },
    { metric: 'Duty Time Limits', compliance: 97.8, status: 'good' },
    { metric: 'Crew Qualifications', compliance: 100, status: 'excellent' },
    { metric: 'Aircraft Maintenance', compliance: 96.5, status: 'good' },
    { metric: 'Documentation', compliance: 99.8, status: 'excellent' }
  ];

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'hourly': return hourlyData;
      case 'quarter': return quarterData.filter((_, i) => i % 4 === 0); // Show every hour for readability
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      case 'annual': return annualData;
    }
  };

  const getDataKey = () => {
    switch (selectedPeriod) {
      case 'hourly': return 'hour';
      case 'quarter': return 'time';
      case 'weekly': return 'day';
      case 'monthly': return 'month';
      case 'annual': return 'year';
    }
  };

  const exportData = () => {
    const data = getCurrentData();
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `egyptair-analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6 border-b border-indigo-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Operations Analytics</h1>
                <p className="text-indigo-100 text-lg">Performance metrics and regulatory compliance</p>
              </div>
            </div>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Period Selector */}
          <div className="flex gap-2">
            {[
              { key: 'hourly', label: 'Hourly', icon: Clock },
              { key: 'quarter', label: 'Quarter-Daily', icon: Clock },
              { key: 'weekly', label: 'Weekly', icon: Calendar },
              { key: 'monthly', label: 'Monthly', icon: Calendar },
              { key: 'annual', label: 'Annual', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedPeriod(key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === key
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Main Operations Chart */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Operations Overview
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={getCurrentData()}>
                <defs>
                  <linearGradient id="colorFlights" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey={getDataKey()} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Area type="monotone" dataKey="flights" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFlights)" name="Total Flights" />
                <Area type="monotone" dataKey="onTime" stroke="#10b981" fillOpacity={1} fill="url(#colorOnTime)" name="On Time" />
                <Area type="monotone" dataKey="delayed" stroke="#ef4444" fillOpacity={1} fill="url(#colorDelayed)" name="Delayed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-sm opacity-90 mb-2">Total Flights</div>
              <div className="text-3xl font-bold">
                {getCurrentData().reduce((sum, d) => sum + (d.flights || 0), 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-sm opacity-90 mb-2">On Time</div>
              <div className="text-3xl font-bold">
                {getCurrentData().reduce((sum, d) => sum + (d.onTime || 0), 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-sm opacity-90 mb-2">Delayed</div>
              <div className="text-3xl font-bold">
                {getCurrentData().reduce((sum, d) => sum + (d.delayed || 0), 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-sm opacity-90 mb-2">On-Time %</div>
              <div className="text-3xl font-bold">
                {(
                  (getCurrentData().reduce((sum, d) => sum + (d.onTime || 0), 0) /
                  getCurrentData().reduce((sum, d) => sum + (d.flights || 0), 0)) * 100
                ).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Delay Reasons */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Delay Reasons Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={delayReasons}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label
                    outerRadius={100}
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

            {/* Regulatory Compliance */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Regulatory Compliance Indicators</h2>
              <div className="space-y-4">
                {complianceData.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        {item.status === 'excellent' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-sm font-semibold text-white">{item.compliance}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.status === 'excellent' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${item.compliance}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

