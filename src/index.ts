import { createRequire } from 'node:module';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSliteClient, type SliteClient } from './client';
import { allTools, registerTools } from './tools';

const require = createRequire(import.meta.url);
const { version } = require('../package.json') as { version: string };

async function main() {
  let client: SliteClient;
  try {
    client = createSliteClient();
  } catch (error) {
    console.error('Failed to initialize Slite client:', error);
    process.exit(1);
  }
  const server = new McpServer({ name: 'slite-mcp', version });
  registerTools(server, client, allTools);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
