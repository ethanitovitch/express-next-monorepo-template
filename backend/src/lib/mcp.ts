import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export function createMcpServer() {
  const mcpServer = new McpServer({
    name: 'vaci-mcp-server',
    version: '1.0.0',
  })

  mcpServer.tool('hello-world', async () => {
    return {
      content: [{ type: 'text' as const, text: 'Hello, world!' }],
    }
  })

  return mcpServer
}
