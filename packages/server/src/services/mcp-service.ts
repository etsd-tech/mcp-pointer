import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { version } from 'process';
import { CSS_DETAIL_OPTIONS, TEXT_DETAIL_OPTIONS } from '@mcp-pointer/shared/detail';
import SharedStateService from './shared-state-service';
import {
  normalizeDetailParameters,
  shapeElementForDetail,
  type DetailParameters,
  type NormalizedDetailParameters,
} from '../utils/element-detail';

enum MCPToolName {
  GET_POINTED_ELEMENT = 'get-pointed-element',
}

enum MCPServerName {
  MCP_POINTER = 'mcp-pointer',
}

export default class MCPService {
  private server: Server;

  private sharedState: SharedStateService;

  constructor(sharedState: SharedStateService) {
    this.sharedState = sharedState;
    this.server = new Server(
      {
        name: MCPServerName.MCP_POINTER,
        version,
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, this.handleListTools.bind(this));
    this.server.setRequestHandler(CallToolRequestSchema, this.handleCallTool.bind(this));
  }

  private async handleListTools() {
    return {
      tools: [
        {
          name: MCPToolName.GET_POINTED_ELEMENT,
          description: 'Get information about the currently pointed/shown DOM element. Control returned payload size with optional textDetail (full|visible|none) and cssLevel (0-3).',
          inputSchema: {
            type: 'object',
            properties: {
              textDetail: {
                type: 'string',
                enum: [...TEXT_DETAIL_OPTIONS],
                description: 'Controls how much text is returned. full (default) includes hidden text fallback, visible uses only rendered text, none omits text fields.',
              },
              cssLevel: {
                type: 'integer',
                enum: [...CSS_DETAIL_OPTIONS],
                description: 'Controls CSS payload detail. 0 omits CSS, 1 includes layout basics, 2 adds box model, 3 returns the full computed style.',
              },
            },
            required: [],
          },
        },
      ],
    };
  }

  private async handleCallTool(request: any) {
    if (request.params.name === MCPToolName.GET_POINTED_ELEMENT) {
      const normalized = normalizeDetailParameters(
        request.params.arguments as DetailParameters | undefined,
      );
      return this.getPointedElement(normalized);
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  private async getPointedElement(details: NormalizedDetailParameters) {
    const processedElement = await this.sharedState.getPointedElement();

    if (!processedElement) {
      return {
        content: [
          {
            type: 'text',
            text: 'No element is currently pointed. '
              + 'The user needs to point an element in their browser using Option+Click.',
          },
        ],
      };
    }

    const shapedElement = shapeElementForDetail(processedElement, details.textDetail, details.cssLevel);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(shapedElement, null, 2),
        },
      ],
    };
  }

  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
