import { sql } from '@vercel/postgres';

/* إحضار كل طلبات الإجازة */
export async function getLeaveRequests(): Promise<any[]> {
  try {
    const result = await sql`SELECT * FROM leave_requests ORDER BY created_at DESC`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return [];
  }
}

/* إنشاء طلب إجازة جديد */
export async function createLeaveRequest(
  crewId: number,
  startDate: string,
  endDate: string,
  type: string,
  notes: string
): Promise<any | null> {
  try {
    const result = await sql`
      INSERT INTO leave_requests (crew_id, start_date, end_date, type, status, notes)
      VALUES (${crewId}, ${startDate}, ${endDate}, ${type}, 'pending', ${notes})
      RETURNING *;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating leave request:', error);
    return null;
  }
}

/* إحضار كل تغطيات الاحتياطي */
export async function getReserveAssignments(): Promise<any[]> {
  try {
    const result = await sql`SELECT * FROM reserve_assignments ORDER BY start_time DESC`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching reserve assignments:', error);
    return [];
  }
}

/* إنشاء تغطية احتياطي */
export async function createReserveAssignment(
  crewId: number,
  startTime: string,
  endTime: string,
  flightId: number | null = null
): Promise<any | null> {
  try {
    const result = await sql`
      INSERT INTO reserve_assignments (crew_id, flight_id, start_time, end_time, status)
      VALUES (${crewId}, ${flightId}, ${startTime}, ${endTime}, 'pending')
      RETURNING *;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating reserve assignment:', error);
    return null;
  }
}

/* إحضار كل طلبات تبديل النوبات */
export async function getTradeRequests(): Promise<any[]> {
  try {
    const result = await sql`SELECT * FROM crew_trade_requests ORDER BY created_at DESC`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching trade requests:', error);
    return [];
  }
}

/* إنشاء طلب تبديل نوبة */
export async function createTradeRequest(
  crewId: number,
  offeredFlightId: number,
  requestedFlightId: number
): Promise<any | null> {
  try {
    const result = await sql`
      INSERT INTO crew_trade_requests (crew_id, offered_flight_id, requested_flight_id, status)
      VALUES (${crewId}, ${offeredFlightId}, ${requestedFlightId}, 'pending')
      RETURNING *;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating trade request:', error);
    return null;
  }
}
