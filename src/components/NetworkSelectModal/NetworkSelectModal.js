import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWalletNetworkSelectOpen } from '../../features/wallet/selectors';
import { walletNetworkSelectClose } from '../../features/wallet/slice';
import { walletConnect } from '../../features/wallet/actions';
import { networkByKey, networkKeys } from '../../config/networks';
import { StyledDialog, StyledDialogContent, StyledDialogTitle } from '../StyledDialog/StyledDialog';
import { makeStyles } from '@material-ui/core';
import styles from './styles';

const useStyles = makeStyles(styles);

const NetworkSelectIcon = memo(function NetworkSelectIcon({ network }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { name } = networkByKey[network];
  const handleConnect = useCallback(() => {
    dispatch(walletNetworkSelectClose());
    dispatch(walletConnect(network));
  }, [dispatch, network]);

  return (
    <button onClick={handleConnect} className={classes.network}>
      <div className={classes.icon}>
        <img
          src={require(`../../images/networks/${network}.svg`).default}
          width="24"
          height="24"
          alt=""
        />
      </div>
      <div>{name}</div>
    </button>
  );
});

const NetworksList = memo(function NetworksList() {
  const classes = useStyles();

  return (
    <div className={classes.networks}>
      {networkKeys.map(network => (
        <NetworkSelectIcon network={network} key={network} />
      ))}
    </div>
  );
});

export const NetworkSelectModal = memo(function NetworkSelectModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectWalletNetworkSelectOpen);
  const handleClose = useCallback(() => {
    dispatch(walletNetworkSelectClose());
  }, [dispatch]);

  return (
    <StyledDialog open={isOpen} onClose={handleClose} fullWidth={true} maxWidth="xs">
      <StyledDialogTitle handleClose={handleClose}>Select Network</StyledDialogTitle>
      <StyledDialogContent>
        <NetworksList />
      </StyledDialogContent>
    </StyledDialog>
  );
});
