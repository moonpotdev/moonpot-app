import { NetworkEntity } from '../entities/network';

export function createFactoryWithCacheByNetwork<T>(
  factoryFn: (network: NetworkEntity) => Promise<T>
): (network: NetworkEntity) => Promise<T> {
  const cacheByNetworkId: { [networkId: NetworkEntity['id']]: Promise<T> } = {};

  return (chain: NetworkEntity): Promise<T> => {
    if (cacheByNetworkId[chain.id] === undefined) {
      cacheByNetworkId[chain.id] = factoryFn(chain);
    }
    return cacheByNetworkId[chain.id];
  };
}
