// Sample flight data for November 2025 - A320 Fleet
// For testing roster generation algorithm

import type { Flight } from '@/lib/roster-generator';

/**
 * Generate sample flights for a month
 * Mix of domestic and international, day and night flights
 */
export function generateSampleFlights(month: number, year: number, aircraftType: string): Flight[] {
  const flights: Flight[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // EgyptAir typical routes for A320
  const routes = [
    // Domestic flights (CAI-based)
    { from: 'CAI', to: 'SSH', duration: 1.0, international: false, layover: false }, // Cairo-Sharm
    { from: 'CAI', to: 'HRG', duration: 1.0, international: false, layover: false }, // Cairo-Hurghada
    { from: 'CAI', to: 'LXR', duration: 1.25, international: false, layover: false }, // Cairo-Luxor
    { from: 'CAI', to: 'ASW', duration: 1.5, international: false, layover: false }, // Cairo-Aswan
    
    // Regional international (short-haul)
    { from: 'CAI', to: 'AMM', duration: 1.5, international: true, layover: false }, // Cairo-Amman
    { from: 'CAI', to: 'BEY', duration: 1.75, international: true, layover: false }, // Cairo-Beirut
    { from: 'CAI', to: 'JED', duration: 2.0, international: true, layover: true }, // Cairo-Jeddah
    { from: 'CAI', to: 'RUH', duration: 2.25, international: true, layover: true }, // Cairo-Riyadh
    { from: 'CAI', to: 'DXB', duration: 3.5, international: true, layover: true }, // Cairo-Dubai
    
    // European routes (medium-haul)
    { from: 'CAI', to: 'ATH', duration: 2.0, international: true, layover: false }, // Cairo-Athens
    { from: 'CAI', to: 'IST', duration: 2.25, international: true, layover: true }, // Cairo-Istanbul
    { from: 'CAI', to: 'LHR', duration: 4.25, international: true, layover: true }, // Cairo-London
    { from: 'CAI', to: 'CDG', duration: 4.25, international: true, layover: true }, // Cairo-Paris
    { from: 'CAI', to: 'FCO', duration: 3.5, international: true, layover: true }, // Cairo-Rome
    { from: 'CAI', to: 'FRA', duration: 4.0, international: true, layover: true }, // Cairo-Frankfurt
  ];
  
  const aircraftRegistrations = ['SU-GDL', 'SU-GDM', 'SU-GDN', 'SU-GDO', 'SU-GDP'];
  
  let flightId = 1;
  
  // Generate flights for each day
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    
    // More flights on weekdays, fewer on weekends
    const flightsPerDay = dayOfWeek === 0 || dayOfWeek === 6 ? 8 : 12;
    
    for (let i = 0; i < flightsPerDay; i++) {
      const route = routes[Math.floor(Math.random() * routes.length)];
      const aircraft = aircraftRegistrations[Math.floor(Math.random() * aircraftRegistrations.length)];
      
      // Generate departure time (spread throughout the day)
      const baseHour = Math.floor((i / flightsPerDay) * 24);
      const hour = baseHour + Math.floor(Math.random() * 2);
      const minute = Math.floor(Math.random() * 60);
      const departureTime = `${String(hour % 24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      
      // Calculate arrival time
      const durationMinutes = route.duration * 60;
      const arrivalMinutes = hour * 60 + minute + durationMinutes;
      const arrivalHour = Math.floor(arrivalMinutes / 60) % 24;
      const arrivalMinute = arrivalMinutes % 60;
      const arrivalTime = `${String(arrivalHour).padStart(2, '0')}:${String(Math.floor(arrivalMinute)).padStart(2, '0')}`;
      
      // Determine if night flight (departure or arrival between 22:00-06:00)
      const isNightFlight = hour >= 22 || hour < 6 || arrivalHour >= 22 || arrivalHour < 6;
      
      // Duty time = flight time + 1 hour (pre-flight) + 0.5 hour (post-flight)
      const dutyHours = route.duration + 1.5;
      
      flights.push({
        id: `FL${String(flightId).padStart(6, '0')}`,
        flight_number: `MS${700 + (flightId % 300)}`,
        aircraft_registration: aircraft,
        departure_airport: route.from,
        arrival_airport: route.to,
        scheduled_departure: departureTime,
        scheduled_arrival: arrivalTime,
        date,
        flight_hours: route.duration,
        duty_hours: dutyHours,
        is_night_flight: isNightFlight,
        is_international: route.international,
        requires_layover: route.layover,
        aircraft_type: aircraftType,
      });
      
      flightId++;
      
      // Add return flight for layover routes (next day)
      if (route.layover && day < daysInMonth) {
        const returnDate = `${year}-${String(month).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;
        const returnHour = (hour + 12) % 24; // Return flight 12 hours later
        const returnDepartureTime = `${String(returnHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        
        const returnArrivalMinutes = returnHour * 60 + minute + durationMinutes;
        const returnArrivalHour = Math.floor(returnArrivalMinutes / 60) % 24;
        const returnArrivalMinute = returnArrivalMinutes % 60;
        const returnArrivalTime = `${String(returnArrivalHour).padStart(2, '0')}:${String(Math.floor(returnArrivalMinute)).padStart(2, '0')}`;
        
        const isReturnNightFlight = returnHour >= 22 || returnHour < 6 || returnArrivalHour >= 22 || returnArrivalHour < 6;
        
        flights.push({
          id: `FL${String(flightId).padStart(6, '0')}`,
          flight_number: `MS${700 + (flightId % 300)}`,
          aircraft_registration: aircraft,
          departure_airport: route.to,
          arrival_airport: route.from,
          scheduled_departure: returnDepartureTime,
          scheduled_arrival: returnArrivalTime,
          date: returnDate,
          flight_hours: route.duration,
          duty_hours: dutyHours,
          is_night_flight: isReturnNightFlight,
          is_international: route.international,
          requires_layover: false, // Return flight doesn't require layover
          aircraft_type: aircraftType,
        });
        
        flightId++;
      }
    }
  }
  
  return flights;
}

// Generate November 2025 flights for A320
export const november2025Flights = generateSampleFlights(11, 2025, 'A320');

console.log(`Generated ${november2025Flights.length} flights for November 2025`);
console.log(`Night flights: ${november2025Flights.filter(f => f.is_night_flight).length}`);
console.log(`International flights: ${november2025Flights.filter(f => f.is_international).length}`);
console.log(`Flights with layover: ${november2025Flights.filter(f => f.requires_layover).length}`);

