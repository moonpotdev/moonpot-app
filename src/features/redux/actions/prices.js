import axios from 'axios';
import { getApiCacheBuster, sleep } from '../../../helpers/utils';
import { MultiCall } from 'eth-multicall';
import { config } from '../../../config/config';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../../config/tokens';
import beefyVaultAbi from '../../../config/abi/beefyvault.json';
import { byDecimals } from '../../../helpers/format';

function derivePrice(token, tokens, prices, ppfs) {
  if (token.underlyingToken) {
    const underlying = tokens[token.underlyingToken];
    if (!underlying) {
      throw new Error(
        `Underlying token ${token.underlyingToken} not found in tokens list for ${token.symbol}/${token.address}`
      );
    }

    if (token.type === 'moo') {
      if (!(token.network in ppfs) || !(token.address in ppfs[token.network])) {
        throw new Error(`PPFS not found for ${token.symbol}/${token.address}`);
      }

      return ppfs[token.network][token.address] * derivePrice(underlying, tokens, prices, ppfs);
    }

    return derivePrice(underlying, tokens, prices, ppfs);
  }

  if (!token.oracleId || !(token.oracleId in prices)) {
    throw new Error(
      `Oracle ${token.oracleId} not found in prices for ${token.symbol}/${token.address}`
    );
  }

  return prices[token.oracleId];
}

async function derivePrices(existing, prices, ppfs) {
  const output = {};

  for (const [network, tokens] of Object.entries(tokensByNetworkSymbol)) {
    output[network] = { ...existing[network] };
    for (const token of Object.values(tokens)) {
      output[network][token.address] = derivePrice(token, tokens, prices, ppfs);
    }
  }

  return output;
}

async function updatePPFS(web3, existing) {
  console.log('redux updatePPFS called.');

  const multicall = {};
  const calls = {};
  const output = {};

  for (const network in web3) {
    multicall[network] = new MultiCall(web3[network], config[network].multicallAddress);
    calls[network] = [];
    output[network] = { ...existing[network] };

    for (const token of Object.values(tokensByNetworkAddress[network])) {
      if (token.type === 'moo') {
        const tokenContract = new web3[network].eth.Contract(beefyVaultAbi, token.address);
        calls[network].push({
          ppfs: tokenContract.methods.getPricePerFullShare(),
          address: token.address,
          network: network,
        });
      }
    }
  }

  const promises = [];
  for (const network in multicall) {
    if (calls[network].length) {
      promises.push(multicall[network].all([calls[network]]));
    }
  }

  if (promises.length) {
    const allResults = await Promise.all(promises);
    for (const [results] of allResults) {
      for (const result of results) {
        output[result.network][result.address] = byDecimals(result.ppfs, 18).toNumber();
      }
    }
  }

  return output;
}

async function updatePrices() {
  console.log('redux fetchPrices called.');
  const retry = async () => {
    await sleep(1000);
    return await updatePrices();
  };

  try {
    const request = await axios.get('https://api.beefy.finance/prices?_=' + getApiCacheBuster(), {
      timeout: 2000,
    });
    return request.status === 200 ? request.data : retry();
  } catch (err) {
    console.log('error fetchPrices()', err);
    return retry();
  }
}

async function updateLPPrices() {
  console.log('redux fetchLPPrices called.');
  const retry = async () => {
    await sleep(1000);
    return await updateLPPrices();
  };

  try {
    const request = await axios.get('https://api.beefy.finance/lps?_=' + getApiCacheBuster(), {
      timeout: 2000,
    });
    return request.status === 200 ? request.data : retry();
  } catch (err) {
    console.log('error fetchPrices()', err);
    return retry();
  }
}

async function updateApy() {
  console.log('redux fetchApy called.');
  const retry = async () => {
    await sleep(1000);
    return await updateApy();
  };
  try {
    const request = await axios.get(
      'https://api.beefy.finance/apy/breakdown?_=' + getApiCacheBuster(),
      { timeout: 2000 }
    );
    return request.status === 200 ? request.data : retry();
  } catch (err) {
    console.log('error fetchApy()', err);
    return retry();
  }
}

const fetchPrices = () => {
  return async (dispatch, getState) => {
    const fetch = async () => {
      const state = getState();
      const [prices, lpPrices, apy, ppfs] = await Promise.all([
        updatePrices(),
        updateLPPrices(),
        updateApy(),
        updatePPFS(state.walletReducer.rpc, state.pricesReducer.ppfs),
      ]);
      const allPrices = {
        ...state.pricesReducer.prices,
        ...prices,
        ...lpPrices,
      };
      const derivedPrices = await derivePrices(
        state.pricesReducer.byNetworkAddress,
        allPrices,
        ppfs
      );

      dispatch({
        type: 'FETCH_PRICES',
        payload: {
          prices: allPrices,
          byNetworkAddress: derivedPrices,
          ppfs: ppfs,
          apy: apy,
          lastUpdated: new Date().getTime(),
        },
      });
    };

    await fetch();

    setInterval(async () => {
      await fetch();
    }, 300000);
  };
};

const obj = {
  fetchPrices,
};

export default obj;
