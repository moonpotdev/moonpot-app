import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectWalletNetwork } from '../../features/wallet/selectors';
import { networkByKey } from '../../config/networks';
import { useWalletConnected } from '../../features/wallet/hooks';

const NotConnected = memo(function NotConnected({ target }) {
  return <>Please connect wallet (TODO: add connect button)</>;
});

const WrongNetwork = memo(function WrongNetwork({ target, current }) {
  const targetNetwork = networkByKey[target];

  return <>Please connect to {targetNetwork.name} (TODO: add switch button)</>;
});

export const WalletRequired = memo(function WalletRequired({
  network = null,
  children,
  NotConnectedComponent = NotConnected,
  WrongNetworkComponent = WrongNetwork,
}) {
  const connected = useWalletConnected();
  const currentNetwork = useSelector(selectWalletNetwork);
  const correctNetwork = useMemo(() => {
    return network === null || currentNetwork === network;
  }, [network, currentNetwork]);
  const connectedCorrectNetwork = useMemo(() => {
    return connected && correctNetwork;
  }, [connected, correctNetwork]);

  if (connectedCorrectNetwork) {
    return children;
  }

  if (connected) {
    return <WrongNetworkComponent target={network} current={currentNetwork} />;
  }

  return <NotConnectedComponent target={network} />;
});
