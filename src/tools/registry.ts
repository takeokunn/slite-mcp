import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { SliteClient } from '@src/client';
import type { ZodRawShape, ZodType } from 'zod';

export type ToolResponse = CallToolResult;

export interface ToolDefinition<TInput = Record<string, never>> {
  name: string;
  description: string;
  inputSchema: ZodType<TInput> | Record<string, never>;
  handler: (client: SliteClient, input: TInput) => Promise<ToolResponse>;
}

export function formatToolResponse(data: unknown): ToolResponse {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

export function formatErrorResponse(error: Error): ToolResponse {
  return {
    content: [{ type: 'text', text: `Error: ${error.message}` }],
    isError: true,
  };
}

export function registerTools(
  server: McpServer,
  client: SliteClient,
  tools: ToolDefinition<unknown>[],
): void {
  for (const tool of tools) {
    const schema = isEmptySchema(tool.inputSchema)
      ? {}
      : { input: tool.inputSchema as ZodType<unknown> };
    server.tool(
      tool.name,
      tool.description,
      schema as ZodRawShape,
      async (args: { input?: unknown }) => {
        try {
          const input = args.input ?? {};
          return await tool.handler(client, input);
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          return formatErrorResponse(err);
        }
      },
    );
  }
}

function isEmptySchema(schema: unknown): schema is Record<string, never> {
  return (
    typeof schema === 'object' &&
    schema !== null &&
    !('_def' in schema) &&
    Object.keys(schema).length === 0
  );
}
