import { useSelector } from 'react-redux';
import {
  selectWalletAddress,
  selectWalletNetwork,
  selectWalletStatus,
  selectWalletWeb3,
} from './selectors';
import { useMemo } from 'react';

export function useWalletConnected() {
  const status = useSelector(selectWalletStatus);
  const web3 = useSelector(selectWalletWeb3);
  const address = useSelector(selectWalletAddress);
  return useMemo(() => {
    return !!(status === 'connected' && web3 && address);
  }, [status, web3, address]);
}

export function useWalletConnectedToNetwork(network) {
  const connected = useWalletConnected();
  const currentNetwork = useSelector(selectWalletNetwork);
  const correctNetwork = useMemo(() => {
    return currentNetwork === network;
  }, [network, currentNetwork]);

  return useMemo(() => {
    return !!(connected && correctNetwork);
  }, [connected, correctNetwork]);
}
