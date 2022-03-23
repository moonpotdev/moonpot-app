import networksConfig from './config';
import { indexBy } from '../../helpers/utils';

export const networks = Object.values(networksConfig);
export const networkByKey = networksConfig;
export const networkById = indexBy(networks, 'chainId');
export const networkKeys = Object.keys(networksConfig);
export const networkIds = Object.keys(networkById);

export function networkKeySupported(key) {
  return key in networkByKey;
}

export function networkIdSupported(chainId) {
  return chainId in networkById;
}

export function networkIdToKey(chainId) {
  return chainId in networkById ? networkById[chainId].key : null;
}

export function networkKeyToId(key) {
  return key in networkByKey ? networkByKey[key].chainId : null;
}

export function networkSetup(key, provider = null) {
  return new Promise((resolve, reject) => {
    provider = provider || window.ethereum;
    if (provider && typeof provider.request === 'function') {
      if (networkKeySupported(key)) {
        provider
          .request({
            method: 'wallet_addEthereumChain',
            params: [networkByKey[key].walletSettings],
          })
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`No network settings configured for network: '${key}'`));
      }
    } else {
      reject(new Error(`Missing provider: '${typeof provider}'`));
    }
  });
}
