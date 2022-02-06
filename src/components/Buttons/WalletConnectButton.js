import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from './PrimaryButton';
import { Translate } from '../Translate';
import { walletConnect } from '../../features/wallet/connect';

// TODO pass network from component
export const WalletConnectButton = function ({
  ButtonComponent = PrimaryButton,
  onClick,
  variant,
  network,
  ...rest
}) {
  const dispatch = useDispatch();
  const address = useSelector(state => state.wallet.address);
  const connected = !!address;

  const handleConnect = useCallback(() => {
    dispatch(walletConnect(network));
    if (onClick) {
      onClick();
    }
  }, [dispatch, onClick, network]);

  return (
    <ButtonComponent onClick={handleConnect} variant={variant} disabled={connected} {...rest}>
      <Translate i18nKey="wallet.connect" />
    </ButtonComponent>
  );
};
