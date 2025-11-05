// Role-based access control utilities

export type UserRole = 'admin' | 'chief_pilot' | 'pilot' | 'dispatcher';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  name: string;
  aircraft_type?: string;
  chief_pilot_id?: number;
}

// Permission definitions
export const PERMISSIONS = {
  // Fleet Management (Chief Pilot limited admin)
  VIEW_FLEET: ['admin', 'chief_pilot'],
  MANAGE_FLEET: ['admin', 'chief_pilot'],
  ASSIGN_CREW: ['admin', 'chief_pilot'],
  CREATE_ROSTER: ['admin', 'chief_pilot'],
  EDIT_ROSTER: ['admin', 'chief_pilot'],
  APPROVE_ROSTER: ['admin'], // Only full admin can approve
  DELETE_ROSTER: ['admin'],
  
  // Full Admin Only
  MANAGE_USERS: ['admin'],
  VIEW_ALL_FLEETS: ['admin'],
  SYSTEM_SETTINGS: ['admin'],
  VIEW_ANALYTICS: ['admin', 'chief_pilot', 'dispatcher'],
  
  // Pilot Permissions
  VIEW_OWN_ROSTER: ['admin', 'chief_pilot', 'pilot'],
  VIEW_SCHEDULE: ['admin', 'chief_pilot', 'pilot', 'dispatcher'],
  
  // Dispatcher Permissions
  VIEW_OPERATIONS: ['admin', 'dispatcher', 'chief_pilot'],
  MANAGE_FLIGHTS: ['admin', 'dispatcher'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  
  const allowedRoles = PERMISSIONS[permission] as readonly UserRole[];
  return allowedRoles.includes(user.role);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  
  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  return !!token;
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    admin: 'System Administrator',
    chief_pilot: 'Chief Pilot',
    pilot: 'Pilot',
    dispatcher: 'Flight Dispatcher',
  };
  
  return roleNames[role];
}

/**
 * Check if user is chief pilot
 */
export function isChiefPilot(user: User | null): boolean {
  return user?.role === 'chief_pilot';
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

/**
 * Get permissions description for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  const permissions: string[] = [];
  
  if (role === 'admin') {
    permissions.push('Full system access');
    permissions.push('Manage all fleets and rosters');
    permissions.push('Approve rosters');
    permissions.push('Manage users and settings');
    permissions.push('View all analytics');
  } else if (role === 'chief_pilot') {
    permissions.push('Manage assigned fleet only');
    permissions.push('Assign crew to aircraft');
    permissions.push('Create and edit rosters');
    permissions.push('View fleet analytics');
    permissions.push('Cannot approve rosters (requires admin)');
    permissions.push('Cannot manage other fleets');
  } else if (role === 'pilot') {
    permissions.push('View own roster');
    permissions.push('View flight schedule');
    permissions.push('View notifications');
  } else if (role === 'dispatcher') {
    permissions.push('View operations dashboard');
    permissions.push('Manage flight schedule');
    permissions.push('View all rosters');
    permissions.push('Cannot modify rosters');
  }
  
  return permissions;
}

/**
 * Validate if chief pilot can access a specific fleet
 */
export function canAccessFleet(user: User | null, aircraftType: string): boolean {
  if (!user) return false;
  
  // Admin can access all fleets
  if (user.role === 'admin') return true;
  
  // Chief pilot can only access their assigned fleet
  if (user.role === 'chief_pilot') {
    return user.aircraft_type === aircraftType;
  }
  
  return false;
}

/**
 * Get accessible aircraft types for user
 */
export function getAccessibleAircraftTypes(user: User | null): string[] {
  if (!user) return [];
  
  // Admin can access all types
  if (user.role === 'admin') {
    return ['A320', 'A321', 'A330', 'B737', 'B777', 'B787'];
  }
  
  // Chief pilot can only access their assigned type
  if (user.role === 'chief_pilot' && user.aircraft_type) {
    return [user.aircraft_type];
  }
  
  return [];
}

