"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Flight {
  flight_number: string;
  aircraft_type: string;
  origin: string;
  origin_name: string;
  origin_city: string;
  destination: string;
  destination_name: string;
  destination_city: string;
  scheduled_departure: string;
  scheduled_arrival: string;
  status: string;
  duration_minutes: number;
  gate: string;
  terminal: string;
}

export default function Schedule() {
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchFlights();
    const interval = setInterval(fetchFlights, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [router]);

  const fetchFlights = async () => {
    try {
      const res = await fetch("/api/schedule");
      const data = await res.json();
      if (data.success) {
        setFlights(data.flights);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-400";
      case "boarding":
        return "bg-yellow-500/20 text-yellow-400";
      case "in flight":
        return "bg-green-500/20 text-green-400";
      case "landed":
        return "bg-gray-500/20 text-gray-400";
      case "delayed":
        return "bg-red-500/20 text-red-400";
      case "cancelled":
        return "bg-red-600/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const filteredFlights = flights.filter((flight) => {
    const matchesFilter = filter === "all" || flight.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      flight.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination_city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: flights.length,
    scheduled: flights.filter((f) => f.status === "Scheduled").length,
    boarding: flights.filter((f) => f.status === "Boarding").length,
    inFlight: flights.filter((f) => f.status === "In Flight").length,
    landed: flights.filter((f) => f.status === "Landed").length,
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading flight schedule...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Header onLogout={handleLogout} />
      <div className="flex-1 p-8 pt-28 md:pt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Flight Schedule</h1>
          <p className="text-slate-400">Complete daily flight operations</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Total Flights</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Scheduled</div>
            <div className="text-2xl font-bold text-blue-400">{stats.scheduled}</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Boarding</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.boarding}</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">In Flight</div>
            <div className="text-2xl font-bold text-green-400">{stats.inFlight}</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Landed</div>
            <div className="text-2xl font-bold text-gray-400">{stats.landed}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by flight number, origin, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="boarding">Boarding</option>
              <option value="in flight">In Flight</option>
              <option value="landed">Landed</option>
            </select>
          </div>
        </div>

        {/* Flight Table */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Flight
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Aircraft
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Departure
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Arrival
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Gate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredFlights.map((flight, index) => (
                  <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{flight.flight_number}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-slate-300">{flight.aircraft_type}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-white">
                        {flight.origin} → {flight.destination}
                      </div>
                      <div className="text-sm text-slate-400">
                        {flight.origin_city} → {flight.destination_city}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-white">{formatTime(flight.scheduled_departure)}</div>
                      <div className="text-xs text-slate-400">Terminal {flight.terminal}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-white">{formatTime(flight.scheduled_arrival)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-slate-300">{formatDuration(flight.duration_minutes)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-slate-300">{flight.gate}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(flight.status)}`}>
                        {flight.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredFlights.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No flights found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

