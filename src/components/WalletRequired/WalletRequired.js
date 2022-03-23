import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWalletStatus } from '../../features/wallet/selectors';
import { networkByKey } from '../../config/networks';
import { useWalletConnected } from '../../features/wallet/hooks';
import { Translate } from '../Translate';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { walletConnect, walletSwitch } from '../../features/wallet/actions';
import Loader from '../loader';
import clsx from 'clsx';
import { SecondaryButton } from '../Buttons/SecondaryButton';

const useStyles = makeStyles(styles);

export const WalletConnectButton = memo(function WalletConnectButton({
  children,
  className,
  ButtonComponent,
  buttonProps,
}) {
  const dispatch = useDispatch();
  const status = useSelector(selectWalletStatus);
  const isPending = useMemo(() => {
    return status === 'connecting';
  }, [status]);
  const isDisconnected = useMemo(() => {
    return status === 'disconnected';
  }, [status]);

  const handleButtonClick = useCallback(() => {
    if (isDisconnected) {
      dispatch(walletConnect());
    }
  }, [dispatch, isDisconnected]);

  return (
    <ButtonComponent className={className} onClick={handleButtonClick} {...buttonProps}>
      {isPending ? <Loader line={true} /> : children}
    </ButtonComponent>
  );
});

const StyledWalletConnectButton = memo(function StyledWalletConnectButton({ children }) {
  const classes = useStyles();

  return (
    <WalletConnectButton
      className={classes.connectButton}
      ButtonComponent={SecondaryButton}
      buttonProps={{
        variant: 'purple',
      }}
    >
      {children}
    </WalletConnectButton>
  );
});

const WalletSwitchNetworkButton = memo(function WalletConnectNetworkButton({ network, children }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const status = useSelector(selectWalletStatus);
  const isPending = useMemo(() => {
    return status === 'connecting';
  }, [status]);
  const handleSwitch = useCallback(() => {
    dispatch(walletSwitch(network));
  }, [dispatch, network]);
  const buttonClasses = clsx(classes.connectButton, {
    [classes.connectButtonPending]: isPending,
  });

  return (
    <SecondaryButton onClick={handleSwitch} variant="purple" className={buttonClasses}>
      {isPending ? <Loader line={true} /> : children}
    </SecondaryButton>
  );
});

const NotConnected = memo(function NotConnected({ target }) {
  const classes = useStyles();
  const targetNetworkName = networkByKey?.[target]?.name;
  const key = targetNetworkName ? 'wallet.connectRequiredNetwork' : 'wallet.connectRequired';

  return (
    <div className={classes.notice}>
      <Translate i18nKey={key} values={{ network: targetNetworkName }} />
      <StyledWalletConnectButton network={target}>
        <Translate i18nKey="wallet.connect" />
      </StyledWalletConnectButton>
    </div>
  );
});

const WrongNetwork = memo(function WrongNetwork({ target, current }) {
  const classes = useStyles();
  const targetNetworkName = networkByKey[target].name;
  const currentNetworkName = current ? networkByKey?.[current]?.name : null;
  const connectedKey = currentNetworkName
    ? 'wallet.connectedToOther'
    : 'wallet.connectedToUnsupported';

  return (
    <div className={classes.notice}>
      <p>
        <Translate i18nKey={connectedKey} values={{ network: currentNetworkName }} />
      </p>
      <p>
        <Translate i18nKey="wallet.switchToNetworkText" values={{ network: targetNetworkName }} />
      </p>
      <WalletSwitchNetworkButton network={target}>
        <Translate i18nKey="wallet.switchToNetworkButton" values={{ network: targetNetworkName }} />
      </WalletSwitchNetworkButton>
    </div>
  );
});

export const WalletRequired = memo(function WalletRequired({
  network = null,
  networkRequired = false,
  children,
  NotConnectedComponent = NotConnected,
  WrongNetworkComponent = WrongNetwork,
}) {
  const [address, currentNetwork] = useWalletConnected();
  const correctNetwork = useMemo(() => {
    return network === null || currentNetwork === network || networkRequired === false;
  }, [network, currentNetwork, networkRequired]);
  const connectedCorrectNetwork = useMemo(() => {
    return address && correctNetwork;
  }, [address, correctNetwork]);

  if (connectedCorrectNetwork) {
    return children;
  }

  if (address) {
    return <WrongNetworkComponent target={network} current={currentNetwork} />;
  }

  return <NotConnectedComponent target={network} />;
});
