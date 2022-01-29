import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from './PrimaryButton';
import { Translate } from '../Translate';
import reduxActions from '../../features/redux/actions';

export const WalletConnectButton = function ({
  ButtonComponent = PrimaryButton,
  onClick,
  variant,
  ...rest
}) {
  const dispatch = useDispatch();
  const address = useSelector(state => state.wallet.address);
  const connected = !!address;

  const handleConnect = useCallback(() => {
    dispatch(reduxActions.wallet.connect());
    if (onClick) {
      onClick();
    }
  }, [dispatch, onClick]);

  return (
    <ButtonComponent onClick={handleConnect} variant={variant} disabled={connected} {...rest}>
      <Translate i18nKey="wallet.connect" />
    </ButtonComponent>
  );
};
