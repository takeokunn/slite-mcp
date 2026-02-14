import { GetUserParamsSchema } from '@src/schemas/user';
import { getUserDefinition } from '@src/tools/user/get-user';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getUser tool', () => {
  it('should return formatted MCP response with user data', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
    };

    const mockClient = createMockClientWithResponse('get', mockUser);

    const result = await getUserDefinition.handler(mockClient, {
      userId: 'user-1',
    });

    expectMcpContent(result, mockUser);
    expect(mockClient.get).toHaveBeenCalledWith('/users/user-1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle user with different ID', async () => {
    const mockUser = {
      id: 'user-42',
      email: 'simple@example.com',
      firstName: 'Simple',
      lastName: 'User',
    };

    const mockClient = createMockClientWithResponse('get', mockUser);

    const result = await getUserDefinition.handler(mockClient, {
      userId: 'user-42',
    });

    expectMcpContent(result, mockUser);
    expect(mockClient.get).toHaveBeenCalledWith('/users/user-42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'User not found');

    await expect(getUserDefinition.handler(mockClient, { userId: 'nonexistent' })).rejects.toThrow(
      'User not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/users/nonexistent');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));

    await expect(getUserDefinition.handler(mockClient, { userId: 'user-1' })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getUserDefinition.handler(mockClient, { userId: 'user-1' })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getUserDefinition.name).toBe('get_user');
    expect(getUserDefinition.description).toBeDefined();
    expect(getUserDefinition.inputSchema).toEqual(GetUserParamsSchema);
  });
});
