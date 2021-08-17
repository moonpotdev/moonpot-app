import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from './PrimaryButton';
import { Trans } from 'react-i18next';
import reduxActions from '../../features/redux/actions';

export const WalletConnectButton = function ({
  ButtonComponent = PrimaryButton,
  onClick,
  ...rest
}) {
  const dispatch = useDispatch();
  const address = useSelector(state => state.walletReducer.address);
  const connected = !!address;

  const handleConnect = useCallback(() => {
    dispatch(reduxActions.wallet.connect());
    if (onClick) {
      onClick();
    }
  }, [dispatch, onClick]);

  return (
    <ButtonComponent onClick={handleConnect} disabled={connected} {...rest}>
      <Trans i18nKey="wallet.connect" />
    </ButtonComponent>
  );
};
