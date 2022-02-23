import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWalletNetwork, selectWalletStatus } from '../../features/wallet/selectors';
import { networkByKey, networks } from '../../config/networks';
import { useWalletConnected } from '../../features/wallet/hooks';
import { Translate } from '../Translate';
import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import styles from './styles';
import { walletConnect } from '../../features/wallet/connect';
import Loader from '../loader';
import clsx from 'clsx';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { walletSwitch } from '../../features/wallet/switch';

const useStyles = makeStyles(styles);

const WalletConnectButton = memo(function WalletConnectButton({ children }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef();
  const status = useSelector(selectWalletStatus);
  const isPending = useMemo(() => {
    return status === 'connecting';
  }, [status]);
  const isDisconnected = useMemo(() => {
    return status === 'disconnected';
  }, [status]);
  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, [setMenuOpen]);

  const handleButtonClick = useCallback(() => {
    if (isDisconnected) {
      setMenuOpen(true);
    }
  }, [isDisconnected, setMenuOpen]);

  const handleConnect = useCallback(
    networkKey => {
      setMenuOpen(false);
      if (isDisconnected) {
        dispatch(walletConnect(networkKey));
      }
    },
    [dispatch, isDisconnected, setMenuOpen]
  );

  const buttonClasses = clsx(classes.connectButton, {
    [classes.connectButtonPending]: isPending,
  });

  return (
    <>
      <SecondaryButton
        className={buttonClasses}
        onClick={handleButtonClick}
        ref={buttonRef}
        variant="purple"
      >
        {isPending ? <Loader line={true} /> : children}
      </SecondaryButton>
      <Menu
        open={menuOpen}
        onClose={handleMenuClose}
        anchorEl={buttonRef.current}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        disableScrollLock={true}
        getContentAnchorEl={null}
      >
        {networks.map(network => (
          <MenuItem key={network.key} onClick={() => handleConnect(network.key)}>
            {network.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

const WalletConnectNetworkButton = memo(function WalletConnectNetworkButton({ network, children }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const status = useSelector(selectWalletStatus);
  const isPending = useMemo(() => {
    return status === 'connecting';
  }, [status]);
  const handleConnect = useCallback(() => {
    dispatch(walletConnect(network));
  }, [dispatch, network]);
  const buttonClasses = clsx(classes.connectButton, {
    [classes.connectButtonPending]: isPending,
  });

  return (
    <SecondaryButton onClick={handleConnect} variant="purple" className={buttonClasses}>
      {isPending ? <Loader line={true} /> : children}
    </SecondaryButton>
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
  const ConnectButton = targetNetworkName ? WalletConnectNetworkButton : WalletConnectButton;

  return (
    <div className={classes.notice}>
      <Translate i18nKey={key} values={{ network: targetNetworkName }} />
      <ConnectButton network={target}>
        <Translate i18nKey="wallet.connect" />
      </ConnectButton>
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
  const connected = useWalletConnected();
  const currentNetwork = useSelector(selectWalletNetwork);
  const correctNetwork = useMemo(() => {
    return network === null || currentNetwork === network || networkRequired === false;
  }, [network, currentNetwork, networkRequired]);
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
