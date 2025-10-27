import { sql } from '@vercel/postgres';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'dispatcher' | 'crew' | 'viewer';
  tenant: string;
  active: boolean;
}

export interface Flight {
  id: number;
  flight_number: string;
  aircraft_registration?: string;
  aircraft_type?: string;
  origin: string;
  destination: string;
  scheduled_departure: Date;
  actual_departure?: Date;
  scheduled_arrival: Date;
  actual_arrival?: Date;
  status: 'scheduled' | 'boarding' | 'departed' | 'in_flight' | 'landed' | 'cancelled' | 'delayed';
  delay_minutes: number;
  gate?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  tenant: string;
}

export interface CrewMember {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  position: 'captain' | 'first_officer' | 'flight_attendant' | 'purser';
  license_number?: string;
  license_expiry?: Date;
  base_airport?: string;
  status: 'available' | 'on_duty' | 'off_duty' | 'sick' | 'vacation';
  phone?: string;
  email?: string;
  tenant: string;
}

export interface Alert {
  id: number;
  type: 'delay' | 'cancellation' | 'weather' | 'maintenance' | 'crew' | 'regulatory' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  flight_id?: number;
  acknowledged: boolean;
  acknowledged_by?: number;
  acknowledged_at?: Date;
  tenant: string;
  created_at: Date;
  expires_at?: Date;
}

export interface Notification {
  id: number;
  user_id: number;
  alert_id: number;
  read: boolean;
  read_at?: Date;
  created_at: Date;
  alert?: Alert;
}

// Database helper functions
export const db = {
  // User operations
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const result = await sql<User>`
        SELECT id, username, email, full_name, role, tenant, active
        FROM users
        WHERE username = ${username} AND active = true
      `;
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async getUserById(id: number): Promise<User | null> {
    try {
      const result = await sql<User>`
        SELECT id, username, email, full_name, role, tenant, active
        FROM users
        WHERE id = ${id} AND active = true
      `;
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async verifyPassword(username: string, password: string): Promise<User | null> {
    try {
      const result = await sql`
        SELECT id, username, email, password_hash, full_name, role, tenant, active
        FROM users
        WHERE username = ${username} AND active = true
      `;
      
      if (result.rows.length === 0) return null;
      
      const user = result.rows[0];
      const bcrypt = require('bcryptjs');
      const isValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isValid) return null;
      
      // Return user without password_hash
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error verifying password:', error);
      return null;
    }
  },

  // Flight operations
  async getFlights(tenant: string, limit: number = 50): Promise<Flight[]> {
    try {
      const result = await sql<Flight>`
        SELECT *
        FROM flights
        WHERE tenant = ${tenant}
        ORDER BY scheduled_departure ASC
        LIMIT ${limit}
      `;
      return result.rows;
    } catch (error) {
      console.error('Error fetching flights:', error);
      return [];
    }
  },

  async getActiveFlights(tenant: string): Promise<Flight[]> {
    try {
      const result = await sql<Flight>`
        SELECT *
        FROM flights
        WHERE tenant = ${tenant}
          AND status IN ('boarding', 'departed', 'in_flight')
        ORDER BY scheduled_departure ASC
      `;
      return result.rows;
    } catch (error) {
      console.error('Error fetching active flights:', error);
      return [];
    }
  },

  async getFlightById(id: number, tenant: string): Promise<Flight | null> {
    try {
      const result = await sql<Flight>`
        SELECT *
        FROM flights
        WHERE id = ${id} AND tenant = ${tenant}
      `;
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching flight:', error);
      return null;
    }
  },

  // Crew operations
  async getCrew(tenant: string): Promise<CrewMember[]> {
    try {
      const result = await sql<CrewMember>`
        SELECT *
        FROM crew
        WHERE tenant = ${tenant}
        ORDER BY last_name, first_name
      `;
      return result.rows;
    } catch (error) {
      console.error('Error fetching crew:', error);
      return [];
    }
  },

  async getCrewOnDuty(tenant: string): Promise<CrewMember[]> {
    try {
      const result = await sql<CrewMember>`
        SELECT *
        FROM crew
        WHERE tenant = ${tenant} AND status = 'on_duty'
        ORDER BY last_name, first_name
      `;
      return result.rows;
    } catch (error) {
      console.error('Error fetching crew on duty:', error);
      return [];
    }
  },

  // Alert operations
  async getAlerts(tenant: string, includeAcknowledged: boolean = false): Promise<Alert[]> {
    try {
      const result = await sql<Alert>`
        SELECT *
        FROM alerts
        WHERE tenant = ${tenant}
          AND (${includeAcknowledged} OR acknowledged = false)
          AND (expires_at IS NULL OR expires_at > NOW())
        ORDER BY created_at DESC
      `;
      return result.rows;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  },

  async acknowledgeAlert(alertId: number, userId: number, tenant: string): Promise<boolean> {
    try {
      await sql`
        UPDATE alerts
        SET acknowledged = true,
            acknowledged_by = ${userId},
            acknowledged_at = NOW()
        WHERE id = ${alertId} AND tenant = ${tenant}
      `;
      return true;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      return false;
    }
  },

  // Notification operations
  async getNotifications(userId: number, limit: number = 20): Promise<Notification[]> {
    try {
      const result = await sql<Notification>`
        SELECT n.*, a.type, a.severity, a.title, a.message, a.created_at as alert_created_at
        FROM notifications n
        JOIN alerts a ON n.alert_id = a.id
        WHERE n.user_id = ${userId}
        ORDER BY n.created_at DESC
        LIMIT ${limit}
      `;
      return result.rows;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async markNotificationRead(notificationId: number, userId: number): Promise<boolean> {
    try {
      await sql`
        UPDATE notifications
        SET read = true, read_at = NOW()
        WHERE id = ${notificationId} AND user_id = ${userId}
      `;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  // Dashboard statistics
  async getDashboardStats(tenant: string) {
    try {
      const [flightsResult, crewResult, alertsResult] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM flights WHERE tenant = ${tenant} AND status IN ('boarding', 'departed', 'in_flight')`,
        sql`SELECT COUNT(*) as count FROM crew WHERE tenant = ${tenant} AND status = 'on_duty'`,
        sql`SELECT COUNT(*) as count FROM alerts WHERE tenant = ${tenant} AND acknowledged = false`
      ]);

      const scheduledFlights = await sql`
        SELECT COUNT(*) as count 
        FROM flights 
        WHERE tenant = ${tenant} 
          AND status = 'scheduled'
          AND scheduled_departure > NOW()
          AND scheduled_departure < NOW() + INTERVAL '24 hours'
      `;

      return {
        activeFlights: parseInt(flightsResult.rows[0]?.count || '0'),
        crewOnDuty: parseInt(crewResult.rows[0]?.count || '0'),
        activeAlerts: parseInt(alertsResult.rows[0]?.count || '0'),
        scheduledFlights: parseInt(scheduledFlights.rows[0]?.count || '0')
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        activeFlights: 0,
        crewOnDuty: 0,
        activeAlerts: 0,
        scheduledFlights: 0
      };
    }
  }
};

