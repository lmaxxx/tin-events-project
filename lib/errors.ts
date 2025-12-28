import { NextResponse } from 'next/server';
import type { ApiResponse } from './types/auth';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not found') {
    super(404, 'NOT_FOUND', message);
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed') {
    super(400, 'VALIDATION_ERROR', message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super(409, 'CONFLICT', message);
  }
}

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    );
  }

  // Unknown error
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    },
    { status: 500 }
  );
}
