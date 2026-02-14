import { GetGroupParamsSchema } from '@src/schemas/group';
import { getGroupDefinition } from '@src/tools/group/get-group';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getGroup tool', () => {
  it('should return formatted MCP response with group data', async () => {
    const mockGroup = {
      id: 'group-1',
      name: 'Engineering',
      memberCount: 10,
    };

    const mockClient = createMockClientWithResponse('get', mockGroup);

    const result = await getGroupDefinition.handler(mockClient, {
      groupId: 'group-1',
    });

    expectMcpContent(result, mockGroup);
    expect(mockClient.get).toHaveBeenCalledWith('/groups/group-1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle group with different ID', async () => {
    const mockGroup = {
      id: 'group-42',
      name: 'Marketing',
      memberCount: 5,
    };

    const mockClient = createMockClientWithResponse('get', mockGroup);

    const result = await getGroupDefinition.handler(mockClient, {
      groupId: 'group-42',
    });

    expectMcpContent(result, mockGroup);
    expect(mockClient.get).toHaveBeenCalledWith('/groups/group-42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Group not found');

    await expect(
      getGroupDefinition.handler(mockClient, { groupId: 'nonexistent' }),
    ).rejects.toThrow('Group not found');
    expect(mockClient.get).toHaveBeenCalledWith('/groups/nonexistent');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));

    await expect(getGroupDefinition.handler(mockClient, { groupId: 'group-1' })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getGroupDefinition.handler(mockClient, { groupId: 'group-1' })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getGroupDefinition.name).toBe('get_group');
    expect(getGroupDefinition.description).toBeDefined();
    expect(getGroupDefinition.inputSchema).toEqual(GetGroupParamsSchema);
  });
});
