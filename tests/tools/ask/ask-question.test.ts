import { AskQuestionParamsSchema } from '@src/schemas/ask';
import { askQuestionDefinition } from '@src/tools/ask/ask-question';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('askQuestion tool', () => {
  it('should return formatted MCP response with answer', async () => {
    const mockAnswer = {
      answer: 'The project uses TypeScript.',
      sources: [{ noteId: 'note-1', title: 'Tech Stack' }],
    };

    const mockClient = createMockClientWithResponse('post', mockAnswer);

    const result = await askQuestionDefinition.handler(mockClient, {
      question: 'What language does the project use?',
    });

    expectMcpContent(result, mockAnswer);
    expect(mockClient.post).toHaveBeenCalledWith('/ask', undefined, {
      question: 'What language does the project use?',
      parentNoteId: undefined,
      assistantId: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should pass optional parentNoteId', async () => {
    const mockAnswer = { answer: 'Scoped answer' };

    const mockClient = createMockClientWithResponse('post', mockAnswer);

    const result = await askQuestionDefinition.handler(mockClient, {
      question: 'What is this about?',
      parentNoteId: 'parent-123',
    });

    expectMcpContent(result, mockAnswer);
    expect(mockClient.post).toHaveBeenCalledWith('/ask', undefined, {
      question: 'What is this about?',
      parentNoteId: 'parent-123',
      assistantId: undefined,
    });
  });

  it('should pass optional assistantId', async () => {
    const mockAnswer = { answer: 'Assistant-specific answer' };

    const mockClient = createMockClientWithResponse('post', mockAnswer);

    const result = await askQuestionDefinition.handler(mockClient, {
      question: 'Summarize this',
      assistantId: 'assistant-456',
    });

    expectMcpContent(result, mockAnswer);
    expect(mockClient.post).toHaveBeenCalledWith('/ask', undefined, {
      question: 'Summarize this',
      parentNoteId: undefined,
      assistantId: 'assistant-456',
    });
  });

  it('should pass all optional parameters', async () => {
    const mockAnswer = { answer: 'Full params answer' };

    const mockClient = createMockClientWithResponse('post', mockAnswer);

    await askQuestionDefinition.handler(mockClient, {
      question: 'Full query',
      parentNoteId: 'parent-789',
      assistantId: 'assistant-012',
    });

    expect(mockClient.post).toHaveBeenCalledWith('/ask', undefined, {
      question: 'Full query',
      parentNoteId: 'parent-789',
      assistantId: 'assistant-012',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Ask failed');

    await expect(askQuestionDefinition.handler(mockClient, { question: 'test' })).rejects.toThrow(
      'Ask failed',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(askQuestionDefinition.handler(mockClient, { question: 'test' })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(askQuestionDefinition.name).toBe('ask_question');
    expect(askQuestionDefinition.description).toBeDefined();
    expect(askQuestionDefinition.inputSchema).toEqual(AskQuestionParamsSchema);
  });
});
