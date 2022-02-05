import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal, { connectors } from 'web3modal';
import { networkByKey } from '../../config/networks';

const modalOptions = {};
const modals = {};

function createModalOptions(network) {
  const allConnectors = {
    injected: {},
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          [network.chainId]: network.rpc[~~(network.rpc.length * Math.random())],
        },
      },
    },
    'custom-binance': {
      display: {
        name: 'Binance',
        description: 'Binance Chain Wallet',
        logo: require('../../images/wallets/binance-wallet.png').default,
      },
      package: 'binance',
      connector: async () => {
        const provider = window.BinanceChain;
        await provider.enable();
        return provider;
      },
    },
    'custom-math': {
      display: {
        name: 'Math',
        description: 'Math Wallet',
        logo: require('../../images/wallets/math-wallet.svg').default,
      },
      package: 'math',
      connector: connectors.injected,
    },
    'custom-twt': {
      display: {
        name: 'Trust',
        description: 'Trust Wallet',
        logo: require('../../images/wallets/trust-wallet.svg').default,
      },
      package: 'twt',
      connector: connectors.injected,
    },
    'custom-safepal': {
      display: {
        name: 'SafePal',
        description: 'SafePal App',
        logo: require('../../images/wallets/safepal-wallet.svg').default,
      },
      package: 'safepal',
      connector: connectors.injected,
    },
  };

  return {
    theme: 'dark',
    network: network.providerName,
    cacheProvider: false,
    providerOptions: Object.fromEntries(
      Object.entries(allConnectors).filter(([key]) => network.supportedWallets.includes(key))
    ),
  };
}

function getModalOptions(networkKey) {
  if (!(networkKey in modalOptions)) {
    modalOptions[networkKey] = createModalOptions(networkByKey[networkKey]);
  }

  return modalOptions[networkKey];
}

export function getModal(networkKey) {
  if (!(networkKey in modals)) {
    modals[networkKey] = new Web3Modal(getModalOptions(networkKey));
  }

  return modals[networkKey];
}