
import { NextResponse } from 'next/server';

/**
 * Custom error class for API-related errors.
 * Allows specifying an HTTP status code along with a message.
 */
export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const ApiResponse = {
  success<T>(data: T, status: number = 200): NextResponse<T> {
    return NextResponse.json(data, { status });
  },

  message(message: string, status: number = 200): NextResponse<{ message: string }> {
    return NextResponse.json({ message }, { status });
  },
};

type ApiHandler = (req: Request, params: { params: any }) => Promise<NextResponse | Response>;

/**
 * A higher-order function that wraps an API route handler to provide
 * centralized error handling.
 * @param handler The API route handler function to wrap.
 * @returns A new function that can be exported as a route handler (e.g., GET, POST).
 */
export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (req: Request, params: { params: any }) => {
    try {
      return await handler(req, params);
    } catch (error) {
      console.error('[API Error]:', error);
      if (error instanceof ApiError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      return NextResponse.json(
        { error: 'An internal server error occurred.' },
        { status: 500 }
      );
    }
  };
}
