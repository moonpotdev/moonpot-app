import React, {
  ComponentType,
  memo,
  NamedExoticComponent,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWalletStatus } from '../../features/wallet/selectors';
import { networkById } from '../../config/networks';
import { useWalletConnected } from '../../features/wallet/hooks';
import { Translate } from '../Translate';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { walletConnect, walletSwitch } from '../../features/wallet/actions';
import { Loader } from '../Loader';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { useAppDispatch } from '../../store';

const useStyles = makeStyles(styles);

// TODO fix types
export type WalletConnectButtonType = PropsWithChildren<{
  className?: string;
  ButtonComponent: ComponentType<any>;
  buttonProps: any;
}>;
export const WalletConnectButton = memo<WalletConnectButtonType>(function WalletConnectButton({
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

type WalletSwitchNetworkButtonProps = PropsWithChildren<{
  network: string;
}>;
const WalletSwitchNetworkButton = memo<WalletSwitchNetworkButtonProps>(
  function WalletConnectNetworkButton({ network, children }) {
    const dispatch = useAppDispatch();
    const classes = useStyles();
    const status = useSelector(selectWalletStatus);
    const isPending = useMemo(() => {
      return status === 'connecting';
    }, [status]);
    const handleSwitch = useCallback(() => {
      dispatch(walletSwitch(network));
    }, [dispatch, network]);

    return (
      <SecondaryButton onClick={handleSwitch} variant="purple" className={classes.connectButton}>
        {isPending ? <Loader line={true} /> : children}
      </SecondaryButton>
    );
  }
);

type NotConnectedProps = PropsWithChildren<{
  target?: string | null;
}>;
const NotConnected = memo<NotConnectedProps>(function NotConnected({ target }) {
  const classes = useStyles();
  const targetNetworkName = target ? networkById?.[target]?.name : null;
  const key = targetNetworkName ? 'wallet.connectRequiredNetwork' : 'wallet.connectRequired';

  return (
    <div className={classes.notice}>
      <Translate i18nKey={key} values={{ network: targetNetworkName }} />
      <StyledWalletConnectButton>
        <Translate i18nKey="wallet.connect" />
      </StyledWalletConnectButton>
    </div>
  );
});

type WrongNetworkProps = PropsWithChildren<{
  target: string;
  current?: string | null;
}>;
const WrongNetwork = memo<WrongNetworkProps>(function WrongNetwork({ target, current }) {
  const classes = useStyles();
  const targetNetworkName = networkById[target].name;
  const currentNetworkName = current ? networkById?.[current]?.name : null;
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

type WalletRequiredProps = PropsWithChildren<{
  network: string | null;
  networkRequired: boolean;
  NotConnectedComponent?: NamedExoticComponent<NotConnectedProps>;
  WrongNetworkComponent?: NamedExoticComponent<WrongNetworkProps>;
}>;
export const WalletRequired = memo<WalletRequiredProps>(function WalletRequired({
  network = null,
  networkRequired = false,
  children,
  NotConnectedComponent = NotConnected,
  WrongNetworkComponent = WrongNetwork,
}) {
  const [address, currentNetwork] = useWalletConnected();
  const correctNetwork = useMemo(() => {
    return network === null || currentNetwork === network || !networkRequired;
  }, [network, currentNetwork, networkRequired]);
  const connectedCorrectNetwork = useMemo(() => {
    return address && correctNetwork;
  }, [address, correctNetwork]);

  if (connectedCorrectNetwork) {
    return <>{children}</>;
  }

  if (address && network) {
    return <WrongNetworkComponent target={network} current={currentNetwork} />;
  }

  return <NotConnectedComponent target={network} />;
});
