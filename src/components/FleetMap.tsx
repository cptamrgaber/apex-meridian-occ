'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Flight {
  id: string;
  callsign: string;
  longitude: number | null;
  latitude: number | null;
  altitude_feet: number | null;
  speed_knots: number | null;
  heading: number | null;
  on_ground: boolean;
  status: string;
}

interface FleetMapProps {
  flights: Flight[];
}

export default function FleetMap({ flights }: FleetMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on Cairo
    const map = L.map(containerRef.current).setView([30.0444, 31.2357], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Create custom icons
    const createPlaneIcon = (isInFlight: boolean) => {
      return L.divIcon({
        className: 'custom-plane-marker',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full ${
            isInFlight ? 'bg-green-500' : 'bg-slate-500'
          } border-2 border-white shadow-lg">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    // Update markers
    const currentMarkerIds = new Set<string>();

    flights.forEach((flight) => {
      if (!flight.latitude || !flight.longitude) return;

      const markerId = flight.id;
      currentMarkerIds.add(markerId);

      const position: L.LatLngExpression = [flight.latitude, flight.longitude];

      if (markersRef.current[markerId]) {
        // Update existing marker
        markersRef.current[markerId].setLatLng(position);
      } else {
        // Create new marker
        const marker = L.marker(position, {
          icon: createPlaneIcon(!flight.on_ground)
        }).addTo(map);

        // Add popup
        marker.bindPopup(`
          <div class="text-sm">
            <div class="font-bold text-lg mb-2">${flight.callsign}</div>
            <div class="space-y-1">
              <div><span class="font-semibold">Status:</span> ${flight.status}</div>
              <div><span class="font-semibold">Altitude:</span> ${flight.altitude_feet?.toLocaleString() || 0} ft</div>
              <div><span class="font-semibold">Speed:</span> ${flight.speed_knots || 0} kts</div>
              <div><span class="font-semibold">Heading:</span> ${flight.heading || 0}°</div>
              <div><span class="font-semibold">Position:</span> ${flight.latitude.toFixed(4)}°, ${flight.longitude.toFixed(4)}°</div>
            </div>
          </div>
        `);

        markersRef.current[markerId] = marker;
      }
    });

    // Remove markers for flights that no longer exist
    Object.keys(markersRef.current).forEach((markerId) => {
      if (!currentMarkerIds.has(markerId)) {
        map.removeLayer(markersRef.current[markerId]);
        delete markersRef.current[markerId];
      }
    });

    // Fit bounds to show all aircraft
    if (flights.length > 0) {
      const validFlights = flights.filter(f => f.latitude && f.longitude);
      if (validFlights.length > 0) {
        const bounds = L.latLngBounds(
          validFlights.map(f => [f.latitude!, f.longitude!] as L.LatLngExpression)
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
      }
    }
  }, [flights]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}

