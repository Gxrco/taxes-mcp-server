# Taxes MCP Server on Cloudflare

This example allows you to deploy a remote MCP server that doesn't require authentication on Cloudflare Workers. 

## Get started: 

This will deploy your MCP server to a URL like: `remote-mcp-server-authless.<your-account>.workers.dev/sse`

Alternatively, you can use the command line below to get the remote MCP Server created on your local machine:
```bash
npm create cloudflare@latest -- my-mcp-server --template=cloudflare/ai/demos/remote-mcp-authless
```

## Connect Claude Desktop to your MCP server

You can also connect to your remote MCP server from local MCP clients, by using the [mcp-remote proxy](https://www.npmjs.com/package/mcp-remote). 


Update with this configuration:

```json
{
  "mcpServers": {
    "taxes-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse" //Contact me via Email to get the remote access or do it by yourself
      ]
    }
  }
}
```

Restart Claude and you should see the tools become available. 
