import type { User, Role } from '@/db';

export type { AuthJWTPayload } from '../auth/jwt';
export type { UserWithRoles } from '../auth/session';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    fields?: Record<string, string[]>;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
}

// Re-export database types
export type { User, Role };
