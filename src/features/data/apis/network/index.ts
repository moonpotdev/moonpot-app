import { NetworkAPI } from './api';

export * from './types';

let networkApi: NetworkAPI | null = null;

export function getNetworkApi() {
  if (networkApi === null) {
    networkApi = new NetworkAPI();
  }

  return networkApi;
}
