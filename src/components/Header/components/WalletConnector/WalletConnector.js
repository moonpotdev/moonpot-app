import React, { useCallback } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import styles from './styles';
import reduxActions from '../../../../features/redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../loader';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

const formatAddress = addr => {
  return addr.substr(0, 6) + '...' + addr.substr(addr.length - 4, 4);
};

const WalletConnector = ({ variant, onConnect, onDisconnect, className, ...rest }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const address = useSelector(state => state.walletReducer.address);
  const pending = useSelector(state => state.walletReducer.pending);
  const dispatch = useDispatch();

  const handleWalletConnect = useCallback(() => {
    if (address) {
      dispatch(reduxActions.wallet.disconnect());
      if (onDisconnect) {
        onDisconnect();
      }
    } else {
      dispatch(reduxActions.wallet.connect());
      if (onConnect) {
        onConnect();
      }
    }
  }, [address, onConnect, onDisconnect, dispatch]);

  const buttonClasses = clsx(classes.wallet, className, {
    [classes.loading]: pending,
    [classes.connected]: !!address,
    [classes.disconnected]: !address,
    [classes.small]: variant === 'small',
  });

  return (
    <Button className={buttonClasses} onClick={handleWalletConnect} {...rest}>
      {pending ? <Loader line={true} /> : address ? formatAddress(address) : t('wallet.connect')}
    </Button>
  );
};

export default WalletConnector;
