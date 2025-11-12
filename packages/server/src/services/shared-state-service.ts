import fs from 'fs/promises';
import { SharedState, ProcessedPointedDOMElement } from '../types';
import logger from '../logger';

export default class SharedStateService {
  static SHARED_STATE_PATH = '/tmp/mcp-pointer-shared-state.json';

  public async saveState(state: SharedState): Promise<void> {
    try {
      const json = JSON.stringify(state, null, 2);
      await fs.writeFile(SharedStateService.SHARED_STATE_PATH, json, 'utf8');

      logger.debug('Pointed data saved to shared state file');
    } catch (error) {
      logger.error('Failed to save pointed data:', error);
    }
  }

  public async getPointedElement(): Promise<ProcessedPointedDOMElement | null> {
    const state = await this.readState();
    if (!state) return null;

    return state.data.processedPointedDOMElement;
  }

  private async readState(): Promise<SharedState | null> {
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
