import { Web3 } from '../../../helpers/web3';
import { getModal } from '../modal';
import { networkChainIdToId, networkSetup } from '../../../config/networks';
import { maybeHexToNumber } from '../../../helpers/utils';

export class WalletConnector {
  modal;
  provider;
  web3;
  options;
  closeHandler;
  accountsChangedHandler;
  chainChangedHandler;

  constructor(options) {
    this.options = options;
  }

  getWeb3() {
    return this.web3;
  }

  async connect() {
    if (this.provider) {
      console.error('already connected');
      throw new Error('Already connected');
    }

    this.modal = getModal();
    this.provider = await this.modal.connect();
    this.web3 = this.createWeb3(this.provider);

    const networkId = await this.getNetworkId();
    const accounts = await this.web3.eth.getAccounts();

    this.subscribeToProvider();

    if (this.options.onConnect) {
      this.options.onConnect({
        network: networkChainIdToId(networkId),
        address: accounts && accounts.length ? accounts[0] : null,
      });
    }
  }

  async switch(networkKey) {
    return networkSetup(networkKey, this.provider);
  }

  disconnect() {
    if (this.modal) {
      this.modal.clearCachedProvider();
      this.modal = null;
    }

    if (this.provider) {
      this.unsubscribeFromProvider(this.provider);
      this.provider = null;
    }

    if (this.web3) {
      this.web3 = null;
    }

    if (this.options.onDisconnect) {
      this.options.onDisconnect();
    }
  }

  extendWeb3Functions(web3) {
    if (typeof web3.eth.extend === 'function') {
      web3.eth.extend({
        methods: [
          {
            name: 'getChainId',
            call: 'eth_chainId',
            outputFormatter: maybeHexToNumber,
          },
        ],
      });
    }
  }

  async getNetworkId() {
    const networkId = await this.web3.eth.getChainId();
    // Trust provider returns an incorrect chainId for BSC. (TODO: Is this still true?)
    return networkId === 86 ? 56 : networkId;
  }

  createWeb3(provider) {
    const web3 = new Web3(provider);
    this.extendWeb3Functions(web3);
    return web3;
  }

  unsubscribeFromProvider() {
    // Stop listening to all events
    if (
      this.provider.removeAllListeners &&
      typeof this.provider.removeAllListeners === 'function'
    ) {
      try {
        this.provider.removeAllListeners();
      } catch (e) {
        console.warn('unsubscribeFromProvider', e);
      }
    }

    // Stop listening to individual events
    if (this.provider.off && typeof this.provider.off === 'function') {
      try {
        this.provider.off('close', this.closeHandler);
        this.provider.off('disconnect', this.closeHandler);
        this.provider.off('accountsChanged', this.accountsChangedHandler);
        this.provider.off('chainChanged', this.chainChangedHandler);
      } catch (e) {
        console.warn('unsubscribeFromProvider', e);
      }
    }

    // At least stop dispatching actions if we can't stop listening to events
    try {
      if (this.closeHandler) {
        this.closeHandler.off();
        this.closeHandler = null;
      }

      if (this.accountsChangedHandler) {
        this.accountsChangedHandler.off();
        this.accountsChangedHandler = null;
      }

      if (this.chainChangedHandler) {
        this.chainChangedHandler.off();
        this.chainChangedHandler = null;
      }
    } catch (e) {
      console.warn('unsubscribeFromProvider', e);
    }
  }

  subscribeToProvider() {
    if (!this.provider.on || typeof this.provider.on !== 'function') {
      console.error('no provider events');
      return null;
    }

    // createEventHandler is workaround for providers that don't have a way to stop listening to events
    this.closeHandler = this.createEventHandler(() => {
      if (this.options.onDisconnect) {
        this.options.onDisconnect();
      }
    });

    this.accountsChangedHandler = this.createEventHandler(accounts => {
      if (this.options.onAddressChanged) {
        this.options.onAddressChanged({
          address: accounts && accounts.length ? accounts[0] : null,
        });
      }
    });

    this.chainChangedHandler = this.createEventHandler(id => {
      if (this.options.onNetworkChanged) {
        const chainId = maybeHexToNumber(id);
        this.options.onNetworkChanged({ network: networkChainIdToId(chainId) });
      }
    });

    this.provider.on('close', this.closeHandler);
    this.provider.on('disconnect', this.closeHandler);
    this.provider.on('accountsChanged', this.accountsChangedHandler);
    this.provider.on('chainChanged', this.chainChangedHandler);
  }

  createEventHandler(handler) {
    const func = function (...args) {
      if (func.active) {
        handler(...args);
      }
    };

    func.active = true;
    func.off = function () {
      func.active = false;
    };

    return func;
  }
}
