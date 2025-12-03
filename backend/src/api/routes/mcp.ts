import { Router } from 'express'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createMcpServer } from '@/lib/mcp'
import { config } from '@/config'

const router = Router()

router.post('/sse', async (req, res) => {
  const token = req.headers['x-api-key']
  if (!token || token !== config.mcp.apiKey) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const mcpServer = createMcpServer()
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  res.on('close', () => {
    transport.close()
  })

  await mcpServer.connect(transport)
  await transport.handleRequest(req, res, req.body)
})

export default router
