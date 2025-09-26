import { PointerMessageType, type TargetedElement, type RawPointedDOMElement } from '@mcp-pointer/shared/types';
import logger from './logger';
import ElementProcessor from './services/element-processor';
import SharedStateService from './services/shared-state-service';
import { SharedState, StateDataV1, StateDataV2 } from './types';

function buildMetadata(messageType: string) {
  const now = new Date().toISOString();

  return {
    receivedAt: now,
    messageType,
  };
}

function buildLegacyState(type: string, data: any): SharedState {
  logger.info('Processing legacy element format');
  const element = data as TargetedElement;

  const stateData: StateDataV1 = {
    rawPointedDOMElement: element,
    processedPointedDOMElement: {
      ...element,
      timestamp: new Date(element.timestamp).toISOString(),
      warnings: undefined,
    },
    metadata: buildMetadata(type),
  };

  return {
    stateVersion: 1,
    data: stateData,
  };
}

function buildNewState(
  type: string,
  data: any,
  elementProcessor: ElementProcessor,
): SharedState {
  logger.info('Processing new raw element format');
  const raw = data as RawPointedDOMElement;
  const processed = elementProcessor.processFromRaw(raw);

  const stateData: StateDataV2 = {
    rawPointedDOMElement: raw,
    processedPointedDOMElement: processed,
    metadata: buildMetadata(type),
  };

  return {
    stateVersion: 2,
    data: stateData,
  };
}

function buildStateFromMessage(
  type: string,
  data: any,
  services: HandlerServices,
): SharedState | null {
  switch (type) {
    case PointerMessageType.LEGACY_ELEMENT_SELECTED:
      return buildLegacyState(type, data);
    case PointerMessageType.DOM_ELEMENT_POINTED:
      return buildNewState(type, data, services.elementProcessor);
    default:
      logger.warn(`Received unknown message type: ${type}`);
      return null;
  }
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
