import type { UserWithRoles } from './session';
import type { Event } from '@/db';

export function hasRole(userRoles: string[], requiredRole: string): boolean {
  return userRoles.includes(requiredRole);
}

export function hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some((role) => userRoles.includes(role));
}

export function canManageEvent(user: UserWithRoles, event: Event): boolean {
  // Admin can manage any event
  if (hasRole(user.roles, 'admin')) {
    return true;
  }

  // Event creator can manage their own event
  if (event.creatorId === user.id) {
    return true;
  }

  return false;
}

export function canAccessAdminPanel(user: UserWithRoles): boolean {
  return hasRole(user.roles, 'admin');
}

export function canCreateEvent(user: UserWithRoles): boolean {
  return hasAnyRole(user.roles, ['organizer', 'admin']);
}

export function canRegisterForEvents(user: UserWithRoles): boolean {
  return hasAnyRole(user.roles, ['user', 'organizer', 'admin']);
}
