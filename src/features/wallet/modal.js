import WalletConnectProvider from '@walletconnect/web3-provider';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import Web3Modal, { connectors } from 'web3modal';
import { networks } from '../../config/networks';
import { sample } from 'lodash';

let modal = null;

function createModalOptions() {
  const allNetworkRpcs = Object.fromEntries(
    networks.map(network => [network.chainId, sample(network.rpc)])
  );
  const firstNetwork = networks[0];

  const allConnectors = {
    injected: {},
    'custom-wallet-connect': {
      display: {
        logo: require('../../images/wallets/wallet-connect.svg').default,
        name: 'Wallet Connect',
        description: 'Scan your WalletConnect to Connect',
      },
      options: {
        rpc: allNetworkRpcs,
      },
      package: WalletConnectProvider,
      connector: async (ProviderPackage, options) => {
        const provider = new ProviderPackage(options);

        await provider.enable();

        return provider;
      },
    },
    'custom-coinbase': {
      display: {
        logo: require('../../images/wallets/coinbase.png').default,
        name: 'Coinbase Wallet',
        description: 'Connect to your Coinbase Wallet',
      },
      options: {
        appName: 'Moonpot',
        appLogoUrl: 'https://play.moonpot.com/images/favicon/apple-icon-180x180.png',
        darkMode: true,
      },
      package: CoinbaseWalletSDK,
      connector: async (ProviderPackage, options) => {
        const walletLink = new ProviderPackage(options);
        const provider = walletLink.makeWeb3Provider(
          sample(firstNetwork.rpc),
          firstNetwork.chainId
        );
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
  };

  return {
    theme: {
      background: '#303050',
      main: '#ffffff',
      secondary: '#D9D9D9',
      border: '#4C4C80',
      hover: '#262640',
    },
    cacheProvider: true,
    providerOptions: allConnectors,
  };
}

export function getModal() {
  if (!modal) {
    modal = new Web3Modal(createModalOptions());
  }

  return modal;
}
