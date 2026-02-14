import { DeleteCustomContentParamsSchema } from '@src/schemas/ask';
import { deleteCustomContentDefinition } from '@src/tools/ask/delete-custom-content';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteCustomContent tool', () => {
  it('should return formatted MCP response after deleting', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteCustomContentDefinition.handler(mockClient, {
      rootId: 'root-1',
      id: 'obj-1',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/ask/index', {
      rootId: 'root-1',
      id: 'obj-1',
    });
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should pass different IDs correctly', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteCustomContentDefinition.handler(mockClient, {
      rootId: 'root-abc',
      id: 'obj-xyz',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/ask/index', {
      rootId: 'root-abc',
      id: 'obj-xyz',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Delete failed');

    await expect(
      deleteCustomContentDefinition.handler(mockClient, {
        rootId: 'root-1',
        id: 'obj-1',
      }),
    ).rejects.toThrow('Delete failed');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Not Found', 404));

    await expect(
      deleteCustomContentDefinition.handler(mockClient, {
        rootId: 'root-1',
        id: 'obj-1',
      }),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteCustomContentDefinition.name).toBe('delete_custom_content');
    expect(deleteCustomContentDefinition.description).toBeDefined();
    expect(deleteCustomContentDefinition.inputSchema).toEqual(DeleteCustomContentParamsSchema);
  });
});
