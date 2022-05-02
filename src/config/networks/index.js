import networksConfig from './config';
import { indexBy } from '../../helpers/utils';

export const networks = Object.entries(networksConfig).map(([id, network]) => ({ id, ...network }));
export const networkById = indexBy(networks, 'id');
export const networkByChainId = indexBy(networks, 'chainId');
export const networkIds = Object.keys(networkById);
export const networkChainIds = Object.keys(networkByChainId);

export function networkKeySupported(networkId) {
  return networkId in networkById;
}

export function networkIdSupported(chainId) {
  return chainId in networkByChainId;
}

export function networkChainIdToId(chainId) {
  return chainId in networkByChainId ? networkByChainId[chainId].id : null;
}

export function networkIdToChainId(networkId) {
  return networkId in networkById ? networkById[networkId].chainId : null;
}

export function networkSetup(networkId, provider = null) {
  return new Promise((resolve, reject) => {
    provider = provider || window.ethereum;
    if (provider && typeof provider.request === 'function') {
      if (networkKeySupported(networkId)) {
        provider
          .request({
            method: 'wallet_addEthereumChain',
            params: [networkById[networkId].walletSettings],
          })
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`No network settings configured for network: '${networkId}'`));
      }
    } else {
      reject(new Error(`Missing provider: '${typeof provider}'`));
    }
  });
}
