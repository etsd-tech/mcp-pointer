import fs from 'fs/promises';
import { type TargetedElement } from '@mcp-pointer/shared/types';
import { SharedState, ProcessedPointedDOMElement, LegacySharedState } from '../types';
import logger from '../logger';

export default class SharedStateService {
  static SHARED_STATE_PATH = '/tmp/mcp-pointer-shared-state.json';

  // New method for storing versioned data
  public async saveState(state: SharedState): Promise<void> {
    try {
      const json = JSON.stringify(state, null, 2);
      await fs.writeFile(SharedStateService.SHARED_STATE_PATH, json, 'utf8');

      logger.debug('Pointed data saved to shared state file');
    } catch (error) {
      logger.error('Failed to save pointed data:', error);
    }
  }

  // Get processed element for MCP service
  public async getPointedElement(): Promise<ProcessedPointedDOMElement | TargetedElement | null> {
    const state = await this.readState();
    if (!state || typeof state !== 'object') return null;

    // If it's the new format, return the processed element
    if ('stateVersion' in state) {
      const sharedState = state as SharedState;
      return sharedState.data.processedPointedDOMElement;
    }

    // Legacy format - return as-is
    const legacyState = state as LegacySharedState;
    return legacyState;
  }

  private async readState(): Promise<SharedState | LegacySharedState | null> {
    try {
      const json = await fs.readFile(SharedStateService.SHARED_STATE_PATH, 'utf8');
      return JSON.parse(json);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.debug('Shared state file does not exist');
        return null;
      }

      logger.error('Failed to read state file:', error);
      return null;
    }
  }
}
