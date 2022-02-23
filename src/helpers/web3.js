import utils from 'web3-utils';
import core from 'web3-core';
import Eth from 'web3-eth';
import Net from 'web3-net';
import Personal from 'web3-eth-personal';
import Web3Original from 'web3';

/**
 * Same as Web3 from 'web3', exceptions:
 * - Shh: removed, not used
 * - Bzz, removed, not used
 * - web3.eth.ens has custom toJSON method added to play nice with redux devtools
 */
class Web3Trimmed {
  version = Web3Original.version;

  utils = utils;

  modules = {
    Eth: Eth,
    Net: Net,
    Personal: Personal,
    // Shh: Shh,
    // Bzz: Bzz
  };

  constructor() {
    const _this = this;

    // sets _requestmanager etc
    core.packageInit(this, arguments);

    this.version = Web3Original.version;
    this.utils = utils;

    this.eth = new Eth(this);
    this.eth.ens.toJSON = () => 'web3-eth-ens instance';
    // this.shh = new Shh(this);
    // this.bzz = new Bzz(this);

    // overwrite package setProvider
    const setProvider = this.setProvider;
    this.setProvider = (provider, net) => {
      setProvider.apply(_this, arguments);

      _this.eth.setRequestManager(_this._requestManager);
      // _this.shh.setRequestManager(_this._requestManager);
      // _this.bzz.setProvider(provider);

      return true;
    };
  }
}

core.addProviders(Web3Trimmed);

export const Web3 = Web3Trimmed;
