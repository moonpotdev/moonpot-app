import { useSelector } from 'react-redux';
import {
  selectWalletAddress,
  selectWalletNetwork,
  selectWalletStatus,
  selectWalletWeb3,
} from './selectors';
import { useMemo } from 'react';

/**
 * network may be null even if wallet connected (if connect to unsupported network)
 * @returns {string[]} [address, network] if wallet connected, otherwise [null, null]
 */
export function useWalletConnected() {
  const status = useSelector(selectWalletStatus);
  const web3 = useSelector(selectWalletWeb3);
  const address = useSelector(selectWalletAddress);
  const network = useSelector(selectWalletNetwork);
  return useMemo(() => {
    return status === 'connected' && web3 && address ? [address, network] : [null, null];
  }, [status, web3, address, network]);
}

/**
 *
 * @param {string} network
 * @returns {string|null} wallet address if connected to `network`, otherwise null
 */
export function useWalletConnectedToNetwork(network) {
  const [connectedAddress, currentNetwork] = useWalletConnected();
  const correctNetwork = useMemo(() => {
    return currentNetwork === network;
  }, [network, currentNetwork]);

  return useMemo(() => {
    return connectedAddress && correctNetwork ? connectedAddress : null;
  }, [connectedAddress, correctNetwork]);
}
