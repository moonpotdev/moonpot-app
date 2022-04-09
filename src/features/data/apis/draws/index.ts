import { DrawsAPI } from './api';
import { createFactoryWithCacheByNetwork } from '../../utils/factory-utils';

export * from './types';

export const getDrawsApiForNetwork = createFactoryWithCacheByNetwork(async network => {
  return new DrawsAPI(network.id, network.drawsSubgraphEndpoint);
});
