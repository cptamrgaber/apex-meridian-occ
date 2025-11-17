'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { MapPin, Plane, Radio, Activity } from 'lucide-react';

// Dynamically import map to avoid SSR issues
const Map = dynamic(() => import('@/components/FleetMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
        <p className="text-slate-400">Loading map...</p>
      </div>
    </div>
  )
});

export default function FleetMapPage() {
  const [liveFlights, setLiveFlights] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    // Initial demo data
    setLiveFlights([
      {
        id: '1',
        callsign: 'MSR777',
        longitude: 31.41,
        latitude: 30.12,
        altitude_feet: 35000,
        speed_knots: 450,
        heading: 90,
        on_ground: false,
        status: 'In Flight'
      },
      {
        id: '2',
        callsign: 'MSR985',
        longitude: 29.98,
        latitude: 31.20,
        altitude_feet: 0,
        speed_knots: 0,
        heading: 0,
        on_ground: true,
        status: 'On Ground'
      },
      {
        id: '3',
        callsign: 'MSR123',
        longitude: 33.81,
        latitude: 27.18,
        altitude_feet: 28000,
        speed_knots: 420,
        heading: 180,
        on_ground: false,
        status: 'In Flight'
      }
    ]);

    // Fetch live data
    const fetchFlights = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/flights/live', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.flights) {
            setLiveFlights(data.flights);
            setLastUpdate(new Date());
          }
        }
      } catch (error) {
        console.error('Failed to fetch live flights:', error);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const now = Date.now();
    const diff = Math.floor((now - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Header onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col pt-28 md:pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-4 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Live Fleet Map</h1>
                <p className="text-blue-100 text-sm">Real-time aircraft tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Plane className="w-4 h-4 text-white" />
                <span className="text-white font-medium">{liveFlights.length} Aircraft</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Live</span>
                <span className="text-blue-200 text-sm">• {formatTime(lastUpdate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <Map flights={liveFlights} />
        </div>

        {/* Legend */}
        <div className="bg-slate-900 border-t border-slate-800 px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">In Flight</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                <span className="text-slate-300">On Ground</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Radio className="w-4 h-4" />
              <span>ADS-B tracking via OpenSky Network</span>
              <span className="text-slate-600">•</span>
              <span>Updates every 15 seconds</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

