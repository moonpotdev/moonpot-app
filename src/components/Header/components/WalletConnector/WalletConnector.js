import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Button, makeStyles, Menu, MenuItem } from '@material-ui/core';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../loader';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { walletDisconnect } from '../../../../features/wallet/disconnect';
import { networkByKey, networks } from '../../../../config/networks';
import { walletConnect } from '../../../../features/wallet/connect';
import {
  selectWalletAddress,
  selectWalletNetwork,
  selectWalletStatus,
} from '../../../../features/wallet/selectors';
import { formatAddressShort } from '../../../../helpers/utils';

const useStyles = makeStyles(styles);

const InnerConnected = memo(function InnerConnected() {
  const networkKey = useSelector(selectWalletNetwork);
  const address = useSelector(selectWalletAddress);

  if (!networkKey) {
    return 'Unsupported network';
  }

  if (!address) {
    return 'No address connected';
  }

  const network = networkByKey[networkKey];
  return (
    <>
      <img
        src={require(`../../../../images/networks/${networkKey}.svg`).default}
        width="24"
        height="24"
        alt={network.name}
      />
      {formatAddressShort(address)}
    </>
  );
});

const WalletConnector = ({ variant, onConnect, onDisconnect, className, ...rest }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef();
  const status = useSelector(selectWalletStatus);
  const isPending = useMemo(() => {
    return status === 'connecting';
  }, [status]);
  const isDisconnected = useMemo(() => {
    return status === 'disconnected';
  }, [status]);
  const isConnected = useMemo(() => {
    return status === 'connected';
  }, [status]);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, [setMenuOpen]);

  const handleButtonClick = useCallback(() => {
    if (isConnected) {
      setMenuOpen(false);
      dispatch(walletDisconnect());
      if (onDisconnect) {
        onDisconnect();
      }
    } else if (isDisconnected) {
      setMenuOpen(true);
    }
  }, [dispatch, isConnected, isDisconnected, setMenuOpen, onDisconnect]);

  const handleConnect = useCallback(
    networkKey => {
      setMenuOpen(false);
      if (isDisconnected) {
        dispatch(walletConnect(networkKey));
        if (onConnect) {
          onConnect();
        }
      }
    },
    [dispatch, isDisconnected, setMenuOpen, onConnect]
  );

  const buttonClasses = clsx(classes.wallet, className, {
    [classes.loading]: isPending,
    [classes.connected]: isConnected,
    [classes.disconnected]: isDisconnected,
    [classes.small]: variant === 'small',
  });

  return (
    <>
      <Button className={buttonClasses} onClick={handleButtonClick} ref={buttonRef} {...rest}>
        {isPending ? (
          <Loader line={true} />
        ) : isConnected ? (
          <InnerConnected />
        ) : (
          t('wallet.connect')
        )}
      </Button>
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
};

export default WalletConnector;
