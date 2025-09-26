import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import SharedStateService from '../../services/shared-state-service';
import { createStateV1, createStateV2, createLegacyElement } from '../factories/shared-state-factory';

jest.mock('../../logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('SharedStateService', () => {
  let service: SharedStateService;
  let testPath: string;

  beforeEach(async () => {
    testPath = path.join(os.tmpdir(), `test-${Date.now()}.json`);
    (SharedStateService as any).SHARED_STATE_PATH = testPath;
    service = new SharedStateService();
  });

  afterEach(async () => {
    try {
      await fs.unlink(testPath);
    } catch {
      // ignore
    }
  });

  describe('saveState', () => {
    it('writes state to file', async () => {
      const state = createStateV2();

      await service.saveState(state);

      const content = await fs.readFile(testPath, 'utf8');
      const parsed = JSON.parse(content);
      expect(parsed.stateVersion).toBe(state.stateVersion);
      expect(parsed.data.processedPointedDOMElement).toEqual(state.data.processedPointedDOMElement);
    });

    it('overwrites corrupted file', async () => {
      await fs.writeFile(testPath, 'invalid json');
      const state = createStateV1();

      await service.saveState(state);

      const content = await fs.readFile(testPath, 'utf8');
      const parsed = JSON.parse(content);
      expect(parsed.stateVersion).toBe(state.stateVersion);
      expect(parsed.data.processedPointedDOMElement).toEqual(state.data.processedPointedDOMElement);
    });
  });

  describe('getPointedElement', () => {
    it('returns processed element from v2 state', async () => {
      const state = createStateV2();
      await fs.writeFile(testPath, JSON.stringify(state));

      const result = await service.getPointedElement();

      expect(result).toEqual(state.data.processedPointedDOMElement);
    });

    it('returns processed element from v1 state', async () => {
      const state = createStateV1();
      await fs.writeFile(testPath, JSON.stringify(state));

      const result = await service.getPointedElement();

      expect(result).toEqual(state.data.processedPointedDOMElement);
    });

    it('returns legacy element as-is', async () => {
      const legacyElement = createLegacyElement();
      await fs.writeFile(testPath, JSON.stringify(legacyElement));

      const result = await service.getPointedElement();

      expect(result).toEqual(legacyElement);
    });

    it('returns null for invalid json', async () => {
      await fs.writeFile(testPath, 'invalid json');

      const result = await service.getPointedElement();

      expect(result).toBeNull();
    });

    it('returns null when file does not exist', async () => {
      const result = await service.getPointedElement();

      expect(result).toBeNull();
    });
  });
});
