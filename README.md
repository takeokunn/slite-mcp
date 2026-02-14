# @takeokunn/slite-mcp

[![npm version](https://img.shields.io/npm/v/@takeokunn/slite-mcp.svg)](https://www.npmjs.com/package/@takeokunn/slite-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Model Context Protocol (MCP) server for Slite, enabling AI assistants to interact with your Slite knowledge base.

## Features

- **Note Management** - Create, read, update, delete, archive, and verify notes
- **Search** - Full-text search across all Slite notes with advanced filtering
- **Ask AI** - Query notes using natural language with Slite's AI
- **User Management** - Look up users by ID or search by name/email
- **Group Management** - Look up groups by ID or search by name
- **Tile Management** - Update or create structured tiles within notes
- **Secure Bearer Token Authentication** - API token-based access control
- **TypeScript Implementation** - Full type safety throughout

## Installation

```bash
npm install -g @takeokunn/slite-mcp
```

Or run directly with npx:

```bash
npx @takeokunn/slite-mcp
```

## Configuration

Set the following environment variable:

| Variable | Description | Example |
|----------|-------------|---------|
| `SLITE_API_TOKEN` | Slite API token | `your_slite_api_token` |

### Getting an API Token

1. Log in to Slite
2. Go to **Settings** → **Integrations** → **API**
3. Generate a new API token
4. Copy the generated token

## Usage

### Claude Desktop Integration

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "slite": {
      "command": "npx",
      "args": ["@takeokunn/slite-mcp"],
      "env": {
        "SLITE_API_TOKEN": "your_slite_api_token"
      }
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "slite": {
      "command": "slite-mcp",
      "env": {
        "SLITE_API_TOKEN": "your_slite_api_token"
      }
    }
  }
}
```

## Available Tools

This MCP server provides 21 tools organized into 7 categories:

### Ask Tools (4)

| Tool | Description |
|------|-------------|
| `ask_question` | Ask a natural language question about your Slite notes |
| `index_custom_content` | Index custom content for AskX (deprecated) |
| `delete_custom_content` | Delete indexed custom content (deprecated) |
| `list_custom_content` | List indexed custom content (deprecated) |

### Me Tools (1)

| Tool | Description |
|------|-------------|
| `get_me` | Get the currently authenticated user information |

### Note Tools (10)

| Tool | Description |
|------|-------------|
| `create_note` | Create a new note from markdown or HTML content |
| `list_notes` | List notes with optional filtering by owner or parent |
| `get_note` | Get a single note by ID with content |
| `delete_note` | Delete a note and all its children (irreversible) |
| `update_note` | Update a note's title or content |
| `get_note_children` | Get child notes of a parent note |
| `verify_note` | Mark a note as verified with optional expiration |
| `flag_note_as_outdated` | Flag a note as outdated with a reason |
| `archive_note` | Archive or unarchive a note |
| `update_note_owner` | Change the owner of a note to a user or group |

### Tile Tools (1)

| Tool | Description |
|------|-------------|
| `update_tile` | Update or create a tile in a Slite note |

### Search Tools (1)

| Tool | Description |
|------|-------------|
| `search_notes` | Search notes by query with filters for review state, date, and more |

### User Tools (2)

| Tool | Description |
|------|-------------|
| `get_user` | Get a single user by ID |
| `search_users` | Search users by email, name, or username |

### Group Tools (2)

| Tool | Description |
|------|-------------|
| `get_group` | Get a single group by ID |
| `search_groups` | Search groups by name |

## Requirements

- Node.js 22+
- Slite account with API access

## License

[MIT](LICENSE)
