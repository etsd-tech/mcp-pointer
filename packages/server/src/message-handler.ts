import { PointerMessageType, type RawPointedDOMElement } from '@mcp-pointer/shared/types';
import logger from './logger';
import ElementProcessor from './services/element-processor';
import SharedStateService from './services/shared-state-service';
import { SharedState, SharedStateData } from './types';

function buildMetadata(messageType: string) {
  const now = new Date().toISOString();

  return {
    receivedAt: now,
    messageType,
  };
}

function buildState(
  type: string,
  data: any,
  elementProcessor: ElementProcessor,
): SharedState {
  logger.info('Processing raw element format');
  const raw = data as RawPointedDOMElement;
  const processed = elementProcessor.processFromRaw(raw);

  const stateData: SharedStateData = {
    rawPointedDOMElement: raw,
    processedPointedDOMElement: processed,
    metadata: buildMetadata(type),
  };

  return {
    data: stateData,
  };
}

function buildStateFromMessage(
  type: string,
  data: any,
  services: HandlerServices,
): SharedState | null {
  if (type === PointerMessageType.DOM_ELEMENT_POINTED) {
    return buildState(type, data, services.elementProcessor);
  }

  logger.warn(`Received unknown message type: ${type}`);
  return null;
}

interface HandlerServices {
  sharedState: SharedStateService;
  elementProcessor: ElementProcessor;
}

const messageHandler = async (type: string, data: any, services: HandlerServices) => {
  const buildedState = buildStateFromMessage(type, data, services);

  if (buildedState) {
    await services.sharedState.saveState(buildedState);
  }
};

export default messageHandler;
