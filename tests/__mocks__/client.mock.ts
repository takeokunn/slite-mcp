import type { SliteClient } from '@src/client';
import { vi } from 'vitest';

export type MockSliteClient = {
  [K in keyof SliteClient]: ReturnType<typeof vi.fn>;
};

/**
 * Creates a mock SliteClient with all methods stubbed using vi.fn()
 */
export function createMockClient(overrides?: Partial<MockSliteClient>): MockSliteClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

/**
 * Creates a mock client with a pre-configured successful response for a specific method.
 *
 * @param method - The HTTP method to mock ('get', 'post', 'put', 'delete')
 * @param response - The response data to return
 * @returns A mock client with the specified method configured
 */
export function createMockClientWithResponse<T>(
  method: keyof SliteClient,
  response: T,
): MockSliteClient {
  return createMockClient({
    [method]: vi.fn().mockResolvedValue(response),
  } as Partial<MockSliteClient>);
}

/**
 * Creates a mock client with a pre-configured error response for a specific method.
 *
 * @param method - The HTTP method to mock ('get', 'post', 'put', 'delete')
 * @param error - The error to throw (can be Error or message string)
 * @param status - Optional HTTP status code to attach to the error
 * @returns A mock client with the specified method configured to reject
 */
export function createMockClientWithError(
  method: keyof SliteClient,
  error: Error | string,
  status?: number,
): MockSliteClient {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  if (status !== undefined) {
    (errorObj as Error & { status?: number }).status = status;
  }
  return createMockClient({
    [method]: vi.fn().mockRejectedValue(errorObj),
  } as Partial<MockSliteClient>);
}
