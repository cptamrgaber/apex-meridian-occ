"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Route {
  flight_num: string;
  origin: string;
  origin_name: string;
  destination: string;
  destination_name: string;
  aircraft: string;
  frequency: string;
  distance_km: number;
}

export default function Routes() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchRoutes();
  }, [router]);

  const fetchRoutes = async () => {
    try {
      const res = await fetch("/api/routes");
      const data = await res.json();
      if (data.success) {
        setRoutes(data.routes);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const regions = {
    domestic: routes.filter(r => r.origin === "CAI" && ["LXR", "SSH", "HRG", "ASW", "ALY"].includes(r.destination)),
    middleEast: routes.filter(r => ["DXB", "KWI", "RUH", "JED", "DOH", "AMM", "BEY"].includes(r.destination)),
    europe: routes.filter(r => ["LHR", "CDG", "FRA", "FCO", "MAD", "ATH", "IST", "AMS"].includes(r.destination)),
    africa: routes.filter(r => ["JNB", "NBO", "ADD", "LOS", "KRT"].includes(r.destination)),
    asia: routes.filter(r => ["PEK", "BKK", "BOM", "NRT"].includes(r.destination)),
    americas: routes.filter(r => ["JFK", "IAD", "YYZ"].includes(r.destination)),
  };

  const stats = {
    total: routes.length,
    domestic: regions.domestic.length,
    international: routes.length - regions.domestic.length,
    destinations: new Set(routes.map(r => r.destination)).size,
  };

  const filteredRoutes = filter === "all" ? routes : 
    filter === "domestic" ? regions.domestic :
    filter === "middleEast" ? regions.middleEast :
    filter === "europe" ? regions.europe :
    filter === "africa" ? regions.africa :
    filter === "asia" ? regions.asia :
    filter === "americas" ? regions.americas : routes;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading route network...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Header onLogout={handleLogout} />
      <div className="flex-1 p-8 pt-28 md:pt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Route Network</h1>
          <p className="text-slate-400">EgyptAir global destinations and flight routes</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Total Routes</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Domestic</div>
            <div className="text-3xl font-bold text-blue-400">{stats.domestic}</div>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">International</div>
            <div className="text-3xl font-bold text-green-400">{stats.international}</div>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Destinations</div>
            <div className="text-3xl font-bold text-purple-400">{stats.destinations}</div>
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">🌍 Middle East</span>
              <span className="text-white font-bold">{regions.middleEast.length}</span>
            </div>
            <div className="text-sm text-slate-400">Dubai, Kuwait, Riyadh, Jeddah</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">🇪🇺 Europe</span>
              <span className="text-white font-bold">{regions.europe.length}</span>
            </div>
            <div className="text-sm text-slate-400">London, Paris, Frankfurt, Rome</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">🌍 Africa</span>
              <span className="text-white font-bold">{regions.africa.length}</span>
            </div>
            <div className="text-sm text-slate-400">Johannesburg, Nairobi, Addis Ababa</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">🌏 Asia</span>
              <span className="text-white font-bold">{regions.asia.length}</span>
            </div>
            <div className="text-sm text-slate-400">Beijing, Bangkok, Mumbai</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">🌎 Americas</span>
              <span className="text-white font-bold">{regions.americas.length}</span>
            </div>
            <div className="text-sm text-slate-400">New York, Washington, Toronto</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">🇪🇬 Domestic</span>
              <span className="text-white font-bold">{regions.domestic.length}</span>
            </div>
            <div className="text-sm text-slate-400">Luxor, Sharm, Hurghada, Aswan</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              All Routes ({stats.total})
            </button>
            <button
              onClick={() => setFilter("domestic")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "domestic"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Domestic ({regions.domestic.length})
            </button>
            <button
              onClick={() => setFilter("middleEast")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "middleEast"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Middle East ({regions.middleEast.length})
            </button>
            <button
              onClick={() => setFilter("europe")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "europe"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Europe ({regions.europe.length})
            </button>
            <button
              onClick={() => setFilter("africa")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "africa"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Africa ({regions.africa.length})
            </button>
            <button
              onClick={() => setFilter("asia")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "asia"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Asia ({regions.asia.length})
            </button>
            <button
              onClick={() => setFilter("americas")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "americas"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Americas ({regions.americas.length})
            </button>
          </div>
        </div>

        {/* Routes Table */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Flight
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Aircraft
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Distance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredRoutes.map((route, index) => (
                  <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{route.flight_num}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-white">
                        {route.origin} → {route.destination}
                      </div>
                      <div className="text-sm text-slate-400">
                        {route.origin_name} → {route.destination_name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-slate-300">{route.aircraft}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        {route.frequency.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-slate-300">{route.distance_km?.toLocaleString() || "N/A"} km</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

