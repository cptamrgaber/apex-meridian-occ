import { NextResponse } from 'next/server';

export async function GET() {
  // Mock flight data
  const flights = [
    {
      id: 'FL001',
      flightNumber: 'AM101',
      origin: 'JFK',
      destination: 'LAX',
      departure: '2025-10-27T10:00:00Z',
      arrival: '2025-10-27T13:30:00Z',
      status: 'On Time',
      aircraft: 'B737-800',
      crew: ['CPT001', 'FO002', 'FA003', 'FA004']
    },
    {
      id: 'FL002',
      flightNumber: 'AM202',
      origin: 'LAX',
      destination: 'SFO',
      departure: '2025-10-27T14:00:00Z',
      arrival: '2025-10-27T15:30:00Z',
      status: 'Delayed',
      aircraft: 'A320',
      crew: ['CPT005', 'FO006', 'FA007', 'FA008']
    },
    {
      id: 'FL003',
      flightNumber: 'AM303',
      origin: 'ORD',
      destination: 'MIA',
      departure: '2025-10-27T11:00:00Z',
      arrival: '2025-10-27T15:00:00Z',
      status: 'On Time',
      aircraft: 'B787-9',
      crew: ['CPT009', 'FO010', 'FA011', 'FA012', 'FA013', 'FA014']
    }
  ];

  return NextResponse.json(flights);
}

