import React, { memo, useCallback, useRef } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../loader';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { walletDisconnect } from '../../../../features/wallet/disconnect';
import { networkByKey } from '../../../../config/networks';
import {
  selectWalletAddress,
  selectWalletNetwork,
  selectWalletStatus,
} from '../../../../features/wallet/selectors';
import { formatAddressShort } from '../../../../helpers/utils';
import { walletNetworkSelectOpen } from '../../../../features/wallet/slice';

const useStyles = makeStyles(styles);

const InnerConnected = memo(function InnerConnected({ networkKey, address }) {
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

const WalletConnector = ({ onConnect, onDisconnect, className, ...rest }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const buttonRef = useRef();
  const status = useSelector(selectWalletStatus);
  const network = useSelector(selectWalletNetwork);
  const address = useSelector(selectWalletAddress);
  const isPending = status === 'connecting';
  const isDisconnected = status === 'disconnected';
  const isConnected = status === 'connected';

  const handleButtonClick = useCallback(() => {
    if (isConnected) {
      dispatch(walletDisconnect());
      if (onDisconnect) {
        onDisconnect();
      }
    } else if (isDisconnected) {
      dispatch(walletNetworkSelectOpen());
    }
  }, [dispatch, isConnected, isDisconnected, onDisconnect]);

  const buttonClasses = clsx(classes.wallet, className, {
    [classes.loading]: isPending,
    [classes.connected]: isConnected,
    [classes.disconnected]: isDisconnected,
    [classes.withIcon]: isConnected && network && address,
  });

  return (
    <>
      <Button className={buttonClasses} onClick={handleButtonClick} ref={buttonRef} {...rest}>
        {isPending ? <Loader line={true} /> : null}
        {isDisconnected ? t('wallet.connect') : null}
        {isConnected ? <InnerConnected networkKey={network} address={address} /> : null}
      </Button>
    </>
  );
};

export default WalletConnector;
