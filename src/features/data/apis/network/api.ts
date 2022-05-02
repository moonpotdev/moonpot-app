import { NetworkConfig } from './types';

export class NetworkAPI {
  async fetchNetworkConfigs(): Promise<NetworkConfig[]> {
    const config = await import('../../../../config/networks/config');
    return Object.entries(config.default).map(([id, network]) => ({ id, ...network }));
  }
}
