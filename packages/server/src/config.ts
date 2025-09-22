import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import logger from './logger';

// Consistent MCP server name across all tools
const MCP_SERVER_NAME = 'pointer';

// Configuration interface and object for WebSocket server (legacy support)
export interface MCPConfig {
  websocket: {
    port: number;
  };
}

export const config: MCPConfig = {
  websocket: {
    port: 7007,
  },
};

// Configuration command support
export enum SupportedTool {
  CLAUDE = 'claude',
  CURSOR = 'cursor',
  WINDSURF = 'windsurf',
  MANUAL = 'manual',
}

const SUPPORTED_TOOLS = Object.values(SupportedTool);

function getPort(): string {
  return process.env.MCP_POINTER_PORT || '7007';
}

function configureClaudeCode(port: string) {
  try {
    logger.info('🔧 Configuring MCP Pointer for Claude Code...');

    // First, try to remove existing server if it exists (ignore errors)
    try {
      execSync(`claude mcp remove ${MCP_SERVER_NAME} -s user`, { stdio: 'pipe' });
      logger.info('🔄 Removed existing MCP Pointer configuration');
    } catch {
      // Ignore errors - server might not exist
    }

    // Now add the server configuration
    const command = `claude mcp add ${MCP_SERVER_NAME} -s user --env MCP_POINTER_PORT=${port} -- npx -y @mcp-pointer/server@latest start`;
    execSync(command, { stdio: 'pipe' });

    logger.info('✅ Successfully configured MCP Pointer for Claude Code (user-wide)');
  } catch (error) {
    logger.error('❌ Failed to configure Claude Code:');
    logger.error((error as Error).message);
    logger.info('💡 Make sure Claude Code CLI is installed and accessible');
    process.exit(1);
  }
}

function configureCursor(port: string) {
  try {
    logger.info('🔧 Configuring MCP Pointer for Cursor IDE...');

    // Create the MCP server configuration
    const cursorConfig = {
      command: 'npx',
      args: ['-y', '@mcp-pointer/server@latest', 'start'],
      env: {
        MCP_POINTER_PORT: port,
      },
    };

    // Generate Cursor deeplink for automatic installation
    const configJson = JSON.stringify(cursorConfig);
    const base64Config = Buffer.from(configJson).toString('base64');
    const deeplink = `cursor://anysphere.cursor-deeplink/mcp/install?name=${MCP_SERVER_NAME}&config=${base64Config}`;

    logger.info('🔗 Opening Cursor to install MCP Pointer automatically...');

    try {
      // Try to open the deeplink
      let openCommand = 'xdg-open';
      if (process.platform === 'darwin') {
        openCommand = 'open';
      } else if (process.platform === 'win32') {
        openCommand = 'start';
      }
      execSync(`${openCommand} "${deeplink}"`, { stdio: 'pipe' });

      logger.info('✅ MCP Pointer configuration sent to Cursor IDE');
      logger.info('💡 Check Cursor for the installation prompt');
    } catch (openError) {
      // Fallback to showing the link
      logger.info('⚠️  Could not automatically open Cursor');
      logger.info('🔗 Please open this link manually to install MCP Pointer:');
      logger.info('');
      logger.info(deeplink);
      logger.info('');
      logger.info('💡 Or copy this configuration to Cursor Settings → MCP:');
      logger.info(JSON.stringify(cursorConfig, null, 2));
    }
  } catch (error) {
    logger.error('❌ Failed to configure Cursor IDE:');
    logger.error((error as Error).message);
    process.exit(1);
  }
}

function configureWindsurf(port: string) {
  try {
    logger.info('🔧 Configuring MCP Pointer for Windsurf IDE...');

    const homeDir = os.homedir();
    const configDir = path.join(homeDir, '.codeium', 'windsurf');
    const configFile = path.join(configDir, 'mcp_config.json');

    // Ensure directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Prepare the MCP Pointer configuration
    const mcpPointerConfig = {
      command: 'npx',
      args: ['-y', '@mcp-pointer/server@latest', 'start'],
      env: {
        MCP_POINTER_PORT: port,
      },
    };

    let windsurfConfig: any = { mcpServers: {} };

    // Read existing config if it exists
    if (fs.existsSync(configFile)) {
      try {
        const existingConfig = fs.readFileSync(configFile, 'utf8');
        windsurfConfig = JSON.parse(existingConfig);

        // Ensure mcpServers object exists
        if (!windsurfConfig.mcpServers) {
          windsurfConfig.mcpServers = {};
        }
      } catch (parseError) {
        logger.info('⚠️  Existing config file is corrupted, creating new one');
        windsurfConfig = { mcpServers: {} };
      }
    }

    // Add or update MCP Pointer configuration
    windsurfConfig.mcpServers[MCP_SERVER_NAME] = mcpPointerConfig;

    // Write the updated configuration
    fs.writeFileSync(configFile, JSON.stringify(windsurfConfig, null, 2));

    logger.info('✅ Successfully configured MCP Pointer for Windsurf IDE');
    logger.info(`📁 Updated: ${configFile}`);
  } catch (error) {
    logger.error('❌ Failed to configure Windsurf IDE:');
    logger.error((error as Error).message);
    process.exit(1);
  }
}

function showManualConfig(port: string) {
  logger.info('🔧 Manual MCP Configuration:');
  logger.info('');
  logger.info('⚠️  Manual configuration required for other MCP-compatible tools');
  logger.info('💡 Add this configuration to your AI tool\'s MCP settings:');
  logger.info('');

  const genericConfig = {
    mcpServers: {
      [MCP_SERVER_NAME]: {
        command: 'npx',
        args: ['-y', '@mcp-pointer/server@latest', 'start'],
        env: {
          MCP_POINTER_PORT: port,
        },
      },
    },
  };

  logger.info(JSON.stringify(genericConfig, null, 2));
  logger.info('');
  logger.info('📋 Configuration copied above - adapt the structure as needed for your tool');
  logger.info('💡 This is the standard MCP server configuration format');
}

function showAvailableTools() {
  logger.info('📋 MCP Pointer Configuration');
  logger.info('');
  logger.info('Usage: mcp-pointer config <tool>');
  logger.info('');
  logger.info('Supported tools:');
  logger.info('  claude    - Automatically configure Claude Code');
  logger.info('  cursor    - Automatically configure Cursor IDE');
  logger.info('  windsurf  - Automatically configure Windsurf IDE');
  logger.info('  manual    - Show manual configuration for other MCP-compatible tools');
  logger.info('');
  logger.info('Examples:');
  logger.info(`  mcp-pointer config claude     # Runs: claude mcp add ${MCP_SERVER_NAME}...`);
  logger.info('  mcp-pointer config cursor     # Opens Cursor deeplink for installation');
  logger.info('  mcp-pointer config windsurf   # Updates ~/.codeium/windsurf/mcp_config.json');
  logger.info('  mcp-pointer config manual     # Shows manual JSON config for other tools');
  logger.info('');
  logger.info('💡 Set MCP_POINTER_PORT environment variable to use a different port (default: 7007)');
}

export default function configCommand(tool?: string) {
  const port = getPort();

  if (!tool) {
    showAvailableTools();
    return;
  }

  const normalizedTool = tool.toLowerCase() as SupportedTool;

  if (!SUPPORTED_TOOLS.includes(normalizedTool)) {
    logger.error(`❌ Unsupported tool: ${tool}`);
    logger.error(`Supported tools: ${SUPPORTED_TOOLS.join(', ')}`);
    process.exit(1);
  }

  switch (normalizedTool) {
    case SupportedTool.CLAUDE:
      configureClaudeCode(port);
      break;
    case SupportedTool.CURSOR:
      configureCursor(port);
      break;
    case SupportedTool.WINDSURF:
      configureWindsurf(port);
      break;
    case SupportedTool.MANUAL:
      showManualConfig(port);
      break;
    default:
      // This should never happen due to the validation above
      logger.error(`❌ Unsupported tool: ${tool}`);
      process.exit(1);
  }
}
