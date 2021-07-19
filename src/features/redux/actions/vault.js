import {HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_DONE} from "../constants";
import BigNumber from "bignumber.js";
import {MultiCall} from "eth-multicall";
import {config} from "../../../config/config";
import {isEmpty} from "../../../helpers/utils";
const gateManagerAbi = require('../../../config/abi/gatemanager.json');

const getPoolsSingle = async (item, state, dispatch) => {
    console.log('redux getPoolsSingle() processing...');
    const web3 = state.walletReducer.rpc;
    const pools = state.vaultReducer.pools;
    const prices = state.pricesReducer.prices;
    const price = (pools[item.id].oracleId in prices) ? prices[pools[item.id].oracleId] : 0;

    const gateContract = new web3[item.network].eth.Contract(gateManagerAbi, item.contractAddress);
    const awardQuery =  await gateContract.methods.awardBalance().call();
    const awardBalance = new BigNumber(awardQuery);

    pools[item.id].awardBalance = awardBalance.dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].tokenDecimals)).toFixed(8);

    dispatch({
        type: HOME_FETCH_POOLS_DONE,
        payload: {
            pools: pools,
            totalTvl: state.vaultReducer.totalTvl,
            isPoolsLoading: false,
            lastUpdated: new Date().getTime()
        }
    });

    return true;
}

const getPoolsAll = async (state, dispatch) => {
    console.log('redux getPoolsAll() processing...');
    const web3 = state.walletReducer.rpc;
    const pools = state.vaultReducer.pools;
    const prices = state.pricesReducer.prices;
    const apy = state.pricesReducer.apy;

    const multicall = [];
    const calls = [];

    for(let key in web3) {
        multicall[key] = new MultiCall(web3[key], config[key].multicallAddress);
        calls[key] = [];
    }

    for (let key in pools) {
        const pool = pools[key];
        const gateContract = new web3[pool.network].eth.Contract(gateManagerAbi, pool.contractAddress);
        calls[pool.network].push({
            id: pool.id,
            awardBalance: gateContract.methods.awardBalance(),
        });
    }


    const promises = [];
    for(const key in multicall) {
        promises.push(multicall[key].all([calls[key]]));
    }
    const results = await Promise.allSettled(promises);

    let response = [];
    results.forEach((result) => {
        if (result.status !== 'fulfilled') {
            console.warn('getPoolsAll error', result.reason);
            // FIXME: queue chain retry?
            return;
        }
        response = [...response, ...result.value[0]];
    });

    for(let i = 0; i < response.length; i++) {
        const item = response[i];
        const price = (pools[item.id].oracleId in prices) ? prices[pools[item.id].oracleId] : 0;
        const awardBalance = new BigNumber(item.awardBalance);

        pools[item.id].apy = (!isEmpty(apy) && item.id in apy) ? apy[item.id] : 0;
        pools[item.id].awardBalance = awardBalance.dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].tokenDecimals)).toFixed(8);
    }

    dispatch({
        type: HOME_FETCH_POOLS_DONE,
        payload: {
            pools: pools,
            totalTvl: state.vaultReducer.totalTvl,
            isPoolsLoading: false,
            lastUpdated: new Date().getTime()
        }
    });

    return true;
}

const fetchPools = (item = false) => {
    return async (dispatch, getState) => {
        const state = getState();
        dispatch({type: HOME_FETCH_POOLS_BEGIN});
        return item ? await getPoolsSingle(item, state, dispatch) : await getPoolsAll(state, dispatch);
    };
}

const obj = {
    fetchPools,
}

export default obj
