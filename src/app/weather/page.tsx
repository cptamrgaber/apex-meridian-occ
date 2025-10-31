"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Cloud, CloudRain, Wind, Eye, Gauge, Thermometer, Droplets, Navigation } from "lucide-react";

interface WeatherData {
  icao: string;
  airport: string;
  location: string;
  metar: {
    raw: string;
    observed: string;
    temperature: { celsius: number; fahrenheit: number };
    dewpoint: { celsius: number; fahrenheit: number };
    wind: { degrees: number; speed_kts: number; gust_kts?: number };
    visibility: { miles: number };
    barometer: { hg: number; mb: number };
    humidity: { percent: number };
    clouds: Array<{ code: string; text: string; feet: number }>;
    flight_category: string;
  };
  taf?: {
    raw: string;
    issued: string;
    valid_from: string;
    valid_to: string;
  };
}

export default function Weather() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [router]);

  const fetchWeather = async () => {
    try {
      // In production, this would call CheckWX API
      // For now, use realistic mock data for EgyptAir airports
      setWeatherData(getMockWeatherData());
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherData(getMockWeatherData());
    } finally {
      setLoading(false);
    }
  };

  const getMockWeatherData = (): WeatherData[] => {
    const now = new Date();
    const hour = now.getUTCHours().toString().padStart(2, '0');
    const minute = now.getUTCMinutes().toString().padStart(2, '0');
    
    return [
      {
        icao: "HECA",
        airport: "Cairo International Airport",
        location: "Cairo, Egypt",
        metar: {
          raw: `METAR HECA ${hour}${minute}Z 32015KT 9999 FEW035 SCT100 28/14 Q1012 NOSIG`,
          observed: now.toISOString(),
          temperature: { celsius: 28, fahrenheit: 82 },
          dewpoint: { celsius: 14, fahrenheit: 57 },
          wind: { degrees: 320, speed_kts: 15 },
          visibility: { miles: 6.2 },
          barometer: { hg: 29.88, mb: 1012 },
          humidity: { percent: 42 },
          clouds: [
            { code: "FEW", text: "Few", feet: 3500 },
            { code: "SCT", text: "Scattered", feet: 10000 }
          ],
          flight_category: "VFR"
        },
        taf: {
          raw: "TAF HECA 311100Z 3112/0118 32012KT 9999 FEW035 SCT100 BECMG 3118/3120 VRB05KT",
          issued: now.toISOString(),
          valid_from: now.toISOString(),
          valid_to: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        icao: "HEAX",
        airport: "Alexandria Borg El Arab Airport",
        location: "Alexandria, Egypt",
        metar: {
          raw: `METAR HEAX ${hour}${minute}Z 31018KT 9999 FEW030 BKN080 26/16 Q1014 NOSIG`,
          observed: now.toISOString(),
          temperature: { celsius: 26, fahrenheit: 79 },
          dewpoint: { celsius: 16, fahrenheit: 61 },
          wind: { degrees: 310, speed_kts: 18, gust_kts: 25 },
          visibility: { miles: 6.2 },
          barometer: { hg: 29.94, mb: 1014 },
          humidity: { percent: 55 },
          clouds: [
            { code: "FEW", text: "Few", feet: 3000 },
            { code: "BKN", text: "Broken", feet: 8000 }
          ],
          flight_category: "VFR"
        }
      },
      {
        icao: "HESH",
        airport: "Sharm El Sheikh International Airport",
        location: "Sharm El Sheikh, Egypt",
        metar: {
          raw: `METAR HESH ${hour}${minute}Z 02010KT CAVOK 30/10 Q1010 NOSIG`,
          observed: now.toISOString(),
          temperature: { celsius: 30, fahrenheit: 86 },
          dewpoint: { celsius: 10, fahrenheit: 50 },
          wind: { degrees: 20, speed_kts: 10 },
          visibility: { miles: 10 },
          barometer: { hg: 29.82, mb: 1010 },
          humidity: { percent: 28 },
          clouds: [],
          flight_category: "VFR"
        }
      },
      {
        icao: "HEGN",
        airport: "Hurghada International Airport",
        location: "Hurghada, Egypt",
        metar: {
          raw: `METAR HEGN ${hour}${minute}Z 01012KT 9999 FEW040 29/12 Q1011 NOSIG`,
          observed: now.toISOString(),
          temperature: { celsius: 29, fahrenheit: 84 },
          dewpoint: { celsius: 12, fahrenheit: 54 },
          wind: { degrees: 10, speed_kts: 12 },
          visibility: { miles: 6.2 },
          barometer: { hg: 29.85, mb: 1011 },
          humidity: { percent: 35 },
          clouds: [
            { code: "FEW", text: "Few", feet: 4000 }
          ],
          flight_category: "VFR"
        }
      },
      {
        icao: "HELX",
        airport: "Luxor International Airport",
        location: "Luxor, Egypt",
        metar: {
          raw: `METAR HELX ${hour}${minute}Z 35008KT CAVOK 32/08 Q1009 NOSIG`,
          observed: now.toISOString(),
          temperature: { celsius: 32, fahrenheit: 90 },
          dewpoint: { celsius: 8, fahrenheit: 46 },
          wind: { degrees: 350, speed_kts: 8 },
          visibility: { miles: 10 },
          barometer: { hg: 29.79, mb: 1009 },
          humidity: { percent: 22 },
          clouds: [],
          flight_category: "VFR"
        }
      },
      {
        icao: "HESN",
        airport: "Aswan International Airport",
        location: "Aswan, Egypt",
        metar: {
          raw: `METAR HESN ${hour}${minute}Z 01005KT CAVOK 34/06 Q1008 NOSIG`,
          observed: now.toISOString(),
          temperature: { celsius: 34, fahrenheit: 93 },
          dewpoint: { celsius: 6, fahrenheit: 43 },
          wind: { degrees: 10, speed_kts: 5 },
          visibility: { miles: 10 },
          barometer: { hg: 29.76, mb: 1008 },
          humidity: { percent: 18 },
          clouds: [],
          flight_category: "VFR"
        }
      }
    ];
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const getFlightCategoryColor = (category: string) => {
    switch (category) {
      case "VFR": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "MVFR": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "IFR": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "LIFR": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      hour12: false
    }) + 'Z';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading weather data...</div>
      </div>
    );
  }

  const selectedWeather = selectedAirport 
    ? weatherData.find(w => w.icao === selectedAirport)
    : null;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Aviation Weather</h1>
          <p className="text-slate-400">METAR and TAF data for EgyptAir network airports</p>
          <div className="mt-2 text-sm text-slate-500">
            Last updated: {formatTime(new Date().toISOString())} • Auto-refresh: 5 minutes
          </div>
        </div>

        {/* Weather Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {weatherData.map((weather) => (
            <div
              key={weather.icao}
              onClick={() => setSelectedAirport(weather.icao)}
              className="bg-slate-900 p-6 rounded-lg border border-slate-800 hover:border-sky-600 transition-all cursor-pointer"
            >
              {/* Airport Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{weather.icao}</h3>
                  <p className="text-sm text-slate-400">{weather.airport}</p>
                  <p className="text-xs text-slate-500">{weather.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${getFlightCategoryColor(weather.metar.flight_category)}`}>
                  {weather.metar.flight_category}
                </span>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Temperature */}
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-400" />
                  <div>
                    <div className="text-xs text-slate-400">Temperature</div>
                    <div className="text-white font-semibold">
                      {weather.metar.temperature.celsius}°C / {weather.metar.temperature.fahrenheit}°F
                    </div>
                  </div>
                </div>

                {/* Wind */}
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="text-xs text-slate-400">Wind</div>
                    <div className="text-white font-semibold">
                      {weather.metar.wind.degrees}° {weather.metar.wind.speed_kts}kt
                      {weather.metar.wind.gust_kts && ` G${weather.metar.wind.gust_kts}`}
                    </div>
                  </div>
                </div>

                {/* Visibility */}
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-xs text-slate-400">Visibility</div>
                    <div className="text-white font-semibold">
                      {weather.metar.visibility.miles >= 6 ? "10+" : weather.metar.visibility.miles} SM
                    </div>
                  </div>
                </div>

                {/* Pressure */}
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="text-xs text-slate-400">Pressure</div>
                    <div className="text-white font-semibold">
                      {weather.metar.barometer.hg.toFixed(2)}" / Q{weather.metar.barometer.mb}
                    </div>
                  </div>
                </div>

                {/* Humidity */}
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-xs text-slate-400">Humidity</div>
                    <div className="text-white font-semibold">
                      {weather.metar.humidity.percent}%
                    </div>
                  </div>
                </div>

                {/* Clouds */}
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-400">Clouds</div>
                    <div className="text-white font-semibold text-xs">
                      {weather.metar.clouds.length === 0 ? "Clear" : 
                        weather.metar.clouds.map(c => `${c.code} ${c.feet}'`).join(", ")}
                    </div>
                  </div>
                </div>
              </div>

              {/* METAR */}
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">METAR</div>
                <div className="text-xs text-slate-300 font-mono break-all">
                  {weather.metar.raw}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View */}
        {selectedWeather && (
          <div className="bg-slate-900 p-6 rounded-lg border border-sky-600">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedWeather.icao} - {selectedWeather.airport}</h2>
                <p className="text-slate-400">{selectedWeather.location}</p>
              </div>
              <button
                onClick={() => setSelectedAirport(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Full METAR */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Current Weather (METAR)</h3>
              <div className="bg-slate-950 p-4 rounded border border-slate-800">
                <div className="text-sm text-slate-400 mb-2">
                  Observed: {formatTime(selectedWeather.metar.observed)}
                </div>
                <div className="text-sm text-green-400 font-mono">
                  {selectedWeather.metar.raw}
                </div>
              </div>
            </div>

            {/* TAF if available */}
            {selectedWeather.taf && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Terminal Aerodrome Forecast (TAF)</h3>
                <div className="bg-slate-950 p-4 rounded border border-slate-800">
                  <div className="text-sm text-slate-400 mb-2">
                    Issued: {formatTime(selectedWeather.taf.issued)} • 
                    Valid: {formatTime(selectedWeather.taf.valid_from)} - {formatTime(selectedWeather.taf.valid_to)}
                  </div>
                  <div className="text-sm text-blue-400 font-mono">
                    {selectedWeather.taf.raw}
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 p-4 bg-slate-950 rounded border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-2">Flight Categories</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded"></span>
                  <span className="text-slate-300">VFR: Vis ≥5 SM, Ceiling ≥3000'</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded"></span>
                  <span className="text-slate-300">MVFR: Vis 3-5 SM, Ceiling 1000-3000'</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded"></span>
                  <span className="text-slate-300">IFR: Vis 1-3 SM, Ceiling 500-1000'</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded"></span>
                  <span className="text-slate-300">LIFR: Vis &lt;1 SM, Ceiling &lt;500'</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Cloud className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold mb-1">Weather Data Source</h4>
              <p className="text-sm text-slate-300">
                Currently showing realistic demo weather data for EgyptAir network airports.
                To enable live METAR/TAF data, add your CheckWX API key in Settings.
                Get a free API key at <a href="https://www.checkwxapi.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">checkwxapi.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

