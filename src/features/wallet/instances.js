import { WalletConnector } from './api/WalletConnector';

let walletConnectorInstance = null;

export function getWalletConnector(options) {
  if (!walletConnectorInstance && !options) {
    throw new Error('Options must be provided when first initiating WalletConnector');
  }

  if (!walletConnectorInstance) {
    walletConnectorInstance = new WalletConnector(options);
  }

  return walletConnectorInstance;
}

export function destroyWalletConnector() {
  walletConnectorInstance.disconnect();
  walletConnectorInstance = null;
}

export function haveWalletConnector() {
  return walletConnectorInstance !== null;
}

export function getWalletWeb3() {
  if (haveWalletConnector()) {
    const wallet = getWalletConnector();
    return wallet.getWeb3();
  }

  return null;
}
