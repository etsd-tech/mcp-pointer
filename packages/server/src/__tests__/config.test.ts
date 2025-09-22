import { execSync } from 'child_process';
import fs from 'fs';
import configCommand, { SupportedTool } from '../config';
import logger from '../logger';

// Mock child_process
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

// Mock fs
jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

// Mock logger
jest.mock('../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockWriteFileSync = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;
const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
const mockReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
const mockLoggerInfo = logger.info as jest.MockedFunction<typeof logger.info>;
const mockLoggerError = logger.error as jest.MockedFunction<typeof logger.error>;

describe('configCommand', () => {
  let originalEnv: string | undefined;
  let mockProcessExit: jest.SpyInstance;

  beforeEach(() => {
    // Store original environment
    originalEnv = process.env.MCP_POINTER_PORT;

    // Mock process.exit
    mockProcessExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('Process exit');
    });

    // Reset all mocks
    jest.clearAllMocks();

    // Set up default mock implementations
    mockExecSync.mockReturnValue(Buffer.from(''));
    mockExistsSync.mockReturnValue(false);
    mockReadFileSync.mockReturnValue('{}');
  });

  afterEach(() => {
    // Restore environment
    if (originalEnv !== undefined) {
      process.env.MCP_POINTER_PORT = originalEnv;
    } else {
      delete process.env.MCP_POINTER_PORT;
    }

    // Restore all mocks
    jest.restoreAllMocks();
  });

  describe('when no tool is provided', () => {
    it('should show available tools and usage without calling execSync', () => {
      configCommand();

      // Check that help messages include consistent naming
      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('MCP Pointer Configuration'));
      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('Usage: mcp-pointer config <tool>'));
      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('claude    - Automatically configure Claude Code'));
      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('claude mcp add pointer'));

      // Should not call execSync for help
      expect(mockExecSync).not.toHaveBeenCalled();
    });
  });

  describe('Claude configuration', () => {
    it('should execute claude mcp add command with default port and pointer name', () => {
      configCommand(SupportedTool.CLAUDE);

      // Verify execSync was called twice (remove + add)
      expect(mockExecSync).toHaveBeenCalledTimes(2);
      const addCommand = mockExecSync.mock.calls[1][0];

      // Verify exact command structure for add command
      const expectedCommand = 'claude mcp add pointer -s user --env MCP_POINTER_PORT=7007 -- npx -y @mcp-pointer/server@latest start';
      expect(addCommand).toBe(expectedCommand);

      // Verify success message
      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('✅ Successfully configured MCP Pointer for Claude Code'));
    });

    it('should use custom port from environment variable', () => {
      process.env.MCP_POINTER_PORT = '8888';

      configCommand(SupportedTool.CLAUDE);

      expect(mockExecSync).toHaveBeenCalledTimes(2);
      const addCommand = mockExecSync.mock.calls[1][0];
      const expectedCommand = 'claude mcp add pointer -s user --env MCP_POINTER_PORT=8888 -- npx -y @mcp-pointer/server@latest start';
      expect(addCommand).toBe(expectedCommand);
    });

    it('should attempt to remove existing server before adding new one', () => {
      configCommand(SupportedTool.CLAUDE);

      // Verify execSync was called twice (remove + add)
      expect(mockExecSync).toHaveBeenCalledTimes(2);

      // First call should be remove command
      const removeCommand = mockExecSync.mock.calls[0][0];
      expect(removeCommand).toBe('claude mcp remove pointer -s user');

      // Second call should be add command
      const addCommand = mockExecSync.mock.calls[1][0];
      expect(addCommand).toBe('claude mcp add pointer -s user --env MCP_POINTER_PORT=7007 -- npx -y @mcp-pointer/server@latest start');

      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('🔄 Removed existing MCP Pointer configuration'));
      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('✅ Successfully configured MCP Pointer for Claude Code'));
    });

    it('should continue adding even if remove fails', () => {
      // Mock remove command to fail, but add command to succeed
      mockExecSync
        .mockImplementationOnce(() => {
          throw new Error('Server not found');
        })
        .mockImplementationOnce(() => Buffer.from(''));

      configCommand(SupportedTool.CLAUDE);

      // Verify execSync was still called twice
      expect(mockExecSync).toHaveBeenCalledTimes(2);

      // Should still log success message
      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('✅ Successfully configured MCP Pointer for Claude Code'));
      // Should not log removal message when remove fails
      expect(mockLoggerInfo).not.toHaveBeenCalledWith(expect.stringContaining('🔄 Removed existing MCP Pointer configuration'));
    });

    it('should handle command failure gracefully', () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('claude: command not found');
      });

      expect(() => configCommand(SupportedTool.CLAUDE)).toThrow('Process exit');

      // Verify process.exit was called with code 1
      expect(mockProcessExit).toHaveBeenCalledWith(1);
      expect(mockLoggerError).toHaveBeenCalledWith(expect.stringContaining('❌ Failed to configure Claude Code'));
      expect(mockLoggerError).toHaveBeenCalledWith('claude: command not found');
    });
  });

  describe('Cursor configuration', () => {
    it('should generate deeplink with correct pointer name and config', () => {
      configCommand(SupportedTool.CURSOR);

      // Should call execSync to open the deeplink
      expect(mockExecSync).toHaveBeenCalledTimes(1);
      const command = mockExecSync.mock.calls[0][0] as string;

      expect(command).toContain('open "cursor://anysphere.cursor-deeplink/mcp/install');
      expect(command).toContain('name=pointer');
      expect(command).toContain('config=');

      // Verify the base64 config contains the right structure
      const configMatch = command.match(/config=([^"]+)/);
      expect(configMatch).toBeTruthy();

      const base64Config = configMatch![1];
      const decodedConfig = Buffer.from(base64Config, 'base64').toString();
      const configObj = JSON.parse(decodedConfig);

      expect(configObj.command).toBe('npx');
      expect(configObj.args).toEqual(['-y', '@mcp-pointer/server@latest', 'start']);
      expect(configObj.env.MCP_POINTER_PORT).toBe('7007');

      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('✅ MCP Pointer configuration sent to Cursor IDE'));
    });

    it('should show fallback when open command fails', () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('open: command not found');
      });

      configCommand(SupportedTool.CURSOR);

      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('Could not automatically open Cursor'));
      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringMatching(/cursor:\/\/anysphere\.cursor-deeplink\/mcp\/install/));
      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('name=pointer'));
      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('"command": "npx"'));
    });
  });

  describe('Windsurf configuration', () => {
    it('should write config file with pointer name', () => {
      configCommand(SupportedTool.WINDSURF);

      // Should not call execSync for windsurf (file operations only)
      expect(mockExecSync).not.toHaveBeenCalled();

      // Verify file was written
      expect(mockWriteFileSync).toHaveBeenCalledTimes(1);
      const [writtenPath, writtenData] = mockWriteFileSync.mock.calls[0];

      expect(String(writtenPath)).toContain('mcp_config.json');

      const writtenConfig = JSON.parse(String(writtenData));
      expect(writtenConfig.mcpServers).toBeDefined();
      expect(writtenConfig.mcpServers.pointer).toBeDefined();

      const pointerConfig = writtenConfig.mcpServers.pointer;
      expect(pointerConfig.command).toBe('npx');
      expect(pointerConfig.args).toEqual(['-y', '@mcp-pointer/server@latest', 'start']);
      expect(pointerConfig.env.MCP_POINTER_PORT).toBe('7007');

      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('✅ Successfully configured MCP Pointer for Windsurf IDE'));
    });
  });

  describe('Manual configuration', () => {
    it('should show manual config with pointer name', () => {
      configCommand(SupportedTool.MANUAL);

      // Should not call execSync for generic config
      expect(mockExecSync).not.toHaveBeenCalled();

      expect(mockLoggerInfo).toHaveBeenCalledWith(expect.stringContaining('Manual configuration required for other MCP-compatible tools'));

      // Verify the JSON contains pointer name (checking the logged messages)
      const loggedMessages = mockLoggerInfo.mock.calls.map((call: any) => call[0]).join(' ');
      expect(loggedMessages).toContain('"pointer"');
      expect(loggedMessages).toContain('"command": "npx"');
      expect(loggedMessages).toContain('"-y"');
      expect(loggedMessages).toContain('"@mcp-pointer/server@latest"');
      expect(loggedMessages).toContain('"start"');
    });
  });

  describe('Invalid tool', () => {
    it('should show error for unsupported tool without calling execSync', () => {
      expect(() => configCommand('invalid-tool')).toThrow('Process exit');

      expect(mockProcessExit).toHaveBeenCalledWith(1);
      expect(mockLoggerError).toHaveBeenCalledWith(expect.stringContaining('❌ Unsupported tool: invalid-tool'));

      // Should not call execSync for invalid tool
      expect(mockExecSync).not.toHaveBeenCalled();
    });
  });
});
