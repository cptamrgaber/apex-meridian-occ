"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function Analytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Mock analytics data
  const metrics = {
    onTimePerformance: 87.5,
    utilizationRate: 92.3,
    loadFactor: 78.6,
    crewEfficiency: 94.1,
  };

  const monthlyFlights = [
    { month: "Jan", flights: 2850, passengers: 425000 },
    { month: "Feb", flights: 2650, passengers: 395000 },
    { month: "Mar", flights: 2950, passengers: 440000 },
    { month: "Apr", flights: 3100, passengers: 465000 },
    { month: "May", flights: 3250, passengers: 485000 },
    { month: "Jun", flights: 3400, passengers: 510000 },
  ];

  const topRoutes = [
    { route: "CAI-DXB", flights: 248, load: 92 },
    { route: "CAI-LHR", flights: 186, load: 88 },
    { route: "CAI-JFK", flights: 124, load: 95 },
    { route: "CAI-RUH", flights: 155, load: 85 },
    { route: "CAI-LXR", flights: 310, load: 76 },
  ];

  const fleetUtilization = [
    { type: "B737-800", count: 30, hours: 3240, util: 93 },
    { type: "A320neo", count: 8, hours: 864, util: 92 },
    { type: "B787-9", count: 8, hours: 920, util: 98 },
    { type: "A330-200", count: 5, hours: 575, util: 98 },
    { type: "B777-300ER", count: 5, hours: 590, util: 100 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Operations Analytics</h1>
          <p className="text-slate-400">Performance metrics and operational insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-2">On-Time Performance</div>
            <div className="text-3xl font-bold text-green-400 mb-2">{metrics.onTimePerformance}%</div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${metrics.onTimePerformance}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-2">Aircraft Utilization</div>
            <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.utilizationRate}%</div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${metrics.utilizationRate}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-2">Load Factor</div>
            <div className="text-3xl font-bold text-purple-400 mb-2">{metrics.loadFactor}%</div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${metrics.loadFactor}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-2">Crew Efficiency</div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">{metrics.crewEfficiency}%</div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${metrics.crewEfficiency}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Monthly Performance</h2>
          <div className="space-y-4">
            {monthlyFlights.map((month) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-12 text-slate-400 font-medium">{month.month}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">
                      {month.flights.toLocaleString()} flights
                    </span>
                    <span className="text-sm text-slate-400">
                      {month.passengers.toLocaleString()} pax
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-blue-500 h-3 rounded-full"
                      style={{ width: `${(month.flights / 3500) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Routes */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6">Top Routes by Traffic</h2>
            <div className="space-y-4">
              {topRoutes.map((route, index) => (
                <div key={route.route} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{route.route}</span>
                      <span className="text-sm text-slate-400">{route.flights} flights/month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${route.load}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-green-400 font-medium">{route.load}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fleet Utilization */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6">Fleet Utilization</h2>
            <div className="space-y-4">
              {fleetUtilization.map((aircraft) => (
                <div key={aircraft.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{aircraft.type}</span>
                    <span className="text-sm text-slate-400">
                      {aircraft.count} aircraft • {aircraft.hours}h/month
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          aircraft.util >= 95
                            ? "bg-green-500"
                            : aircraft.util >= 85
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${aircraft.util}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        aircraft.util >= 95
                          ? "text-green-400"
                          : aircraft.util >= 85
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {aircraft.util}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-2">Average Delay</div>
            <div className="text-2xl font-bold text-white">12.5 min</div>
            <div className="text-xs text-green-400 mt-1">↓ 15% vs last month</div>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-2">Cancellation Rate</div>
            <div className="text-2xl font-bold text-white">0.8%</div>
            <div className="text-xs text-green-400 mt-1">↓ 0.3% vs last month</div>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-2">Customer Satisfaction</div>
            <div className="text-2xl font-bold text-white">4.2/5.0</div>
            <div className="text-xs text-green-400 mt-1">↑ 0.1 vs last month</div>
          </div>
        </div>
      </div>
    </div>
  );
}

