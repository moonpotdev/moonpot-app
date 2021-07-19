import {HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_DONE} from "../constants";
import BigNumber from "bignumber.js";
import {MultiCall} from "eth-multicall";
import {config} from "../../../config/config";
import {isEmpty} from "../../../helpers/utils";
const gateManagerAbi = require('../../../config/abi/gatemanager.json');
const ecr20Abi = require('../../../config/abi/erc20.json');

const getPoolsSingle = async (item, state, dispatch) => {
    console.log('redux getPoolsSingle() processing...');
    const web3 = state.walletReducer.rpc;
    const pools = state.vaultReducer.pools;
    const prices = state.pricesReducer.prices;
    const apy = state.pricesReducer.apy;

    const gateContract = new web3[item.network].eth.Contract(gateManagerAbi, item.contractAddress);
    const awardQuery =  await gateContract.methods.awardBalance().call();
    const awardPrice = (pools[item.id].oracleId in prices) ? prices[pools[item.id].oracleId] : 0;
    const awardBalance = new BigNumber(awardQuery).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].tokenDecimals));

    pools[item.id].awardBalance = awardBalance;
    pools[item.id].awardBalanceUsd = awardBalance.times(new BigNumber(awardPrice));
    pools[item.id].sponsorBalance = new BigNumber(0);
    pools[item.id].sponsorBalanceUsd = new BigNumber(0);
    pools[item.id].apy = (!isEmpty(apy) && pools[item.id].apyId in apy) ? (new BigNumber(apy[pools[item.id].apyId].totalApy).times(100).div(2).toFixed(2)) : 0;

    if(!isEmpty(item.sponsorAddress)) {
        const sponsorContract = new web3[item.network].eth.Contract(ecr20Abi, item.sponsorAddress);
        const sponsorQuery = await sponsorContract.methods.balanceOf(item.prizepoolAddress).call();
        const sponsorPrice = (pools[item.id].sponsorToken in prices) ? prices[pools[item.id].sponsorToken] : 0;
        const sponsorBalance = new BigNumber(sponsorQuery).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].sponsorTokenDecimals));

        pools[item.id].sponsorBalance = sponsorBalance;
        pools[item.id].sponsorBalanceUsd = sponsorBalance.times(sponsorPrice);
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

const getPoolsAll = async (state, dispatch) => {
    console.log('redux getPoolsAll() processing...');
    const web3 = state.walletReducer.rpc;
    const pools = state.vaultReducer.pools;
    const prices = state.pricesReducer.prices;
    const apy = state.pricesReducer.apy;

    const multicall = [];
    const calls = [];
    const sponsors = [];

    for(let key in web3) {
        multicall[key] = new MultiCall(web3[key], config[key].multicallAddress);
        calls[key] = [];
        sponsors[key] = [];
    }

    for (let key in pools) {
        const pool = pools[key];
        const gateContract = new web3[pool.network].eth.Contract(gateManagerAbi, pool.contractAddress);
        calls[pool.network].push({
            id: pool.id,
            awardBalance: gateContract.methods.awardBalance(),
        });

        if(!isEmpty(pool.sponsorAddress)) {
            const sponsorContract = new web3[pool.network].eth.Contract(ecr20Abi, pool.sponsorAddress);
            sponsors[pool.network].push({
                id: pool.id,
                sponsorBalance: sponsorContract.methods.balanceOf(pool.prizepoolAddress),
            });
        }
    }


    const promises = [];
    for(const key in multicall) {
        promises.push(multicall[key].all([calls[key]]));
        promises.push(multicall[key].all([sponsors[key]]));
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
        if(!isEmpty(item.awardBalance)) {
            const awardPrice = (pools[item.id].oracleId in prices) ? prices[pools[item.id].oracleId] : 0;
            const awardBalance = new BigNumber(item.awardBalance).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].tokenDecimals));

            pools[item.id].awardBalance = awardBalance;
            pools[item.id].awardBalanceUsd = awardBalance.times(awardPrice);
            pools[item.id].apy = (!isEmpty(apy) && pools[item.id].apyId in apy) ? (new BigNumber(apy[pools[item.id].apyId].totalApy).times(100).div(2).toFixed(2)) : 0;
        }

        if(!isEmpty(item.sponsorBalance)) {
            const sponsorPrice = (pools[item.id].sponsorToken in prices) ? prices[pools[item.id].sponsorToken] : 0;
            const sponsorBalance = new BigNumber(item.sponsorBalance).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].sponsorTokenDecimals));

            pools[item.id].sponsorBalance = sponsorBalance;
            pools[item.id].sponsorBalanceUsd = sponsorBalance.times(new BigNumber(sponsorPrice));
        }
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
