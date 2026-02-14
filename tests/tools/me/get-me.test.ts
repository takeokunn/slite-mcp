import { getMeDefinition } from '@src/tools/me/get-me';
import { describe, expect, it } from 'vitest';

import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMe tool', () => {
  it('should return formatted MCP response with current user data', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'current@example.com',
      firstName: 'Current',
      lastName: 'User',
    };

    const mockClient = createMockClientWithResponse('get', mockUser);

    const result = await getMeDefinition.handler(mockClient, {});

    expectMcpContent(result, mockUser);
    expect(mockClient.get).toHaveBeenCalledWith('/me');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle user with extended attributes', async () => {
    const mockUser = {
      id: 'user-2',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      organizationId: 'org-1',
    };

    const mockClient = createMockClientWithResponse('get', mockUser);

    const result = await getMeDefinition.handler(mockClient, {});

    expectMcpContent(result, mockUser);
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('get', 'Unauthorized', 401);

    await expect(getMeDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should propagate session expired errors', async () => {
    const mockClient = createMockClientWithError('get', 'Session expired');

    await expect(getMeDefinition.handler(mockClient, {})).rejects.toThrow('Session expired');
  });

  it('should have correct tool definition metadata', () => {
    expect(getMeDefinition.name).toBe('get_me');
    expect(getMeDefinition.description).toBeDefined();
  });
});
