import {HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_DONE} from "../constants";
import BigNumber from "bignumber.js";
import {MultiCall} from "eth-multicall";
import {config} from "../../../config/config";
import {isEmpty} from "../../../helpers/utils";
import {byDecimals, formatTvl} from "../../../helpers/format";

const gateManagerAbi = require('../../../config/abi/gatemanager.json');
const ecr20Abi = require('../../../config/abi/erc20.json');
const prizeStrategyAbi = require('../../../config/abi/prizestrategy.json');

const getPools = async (items, state, dispatch) => {
    const web3 = state.walletReducer.rpc;
    const pools = state.vaultReducer.pools;
    const prices = state.pricesReducer.prices;
    const apy = state.pricesReducer.apy;

    const multicall = [];
    const calls = [];
    const sponsors = [];
    const strategy = [];
    const ticket = [];

    for (let key in web3) {
        multicall[key] = new MultiCall(web3[key], config[key].multicallAddress);
        calls[key] = [];
        sponsors[key] = [];
        strategy[key] = [];
        ticket[key] = [];
    }

    for (let key in items) {
        const pool = items[key];
        const gateContract = new web3[pool.network].eth.Contract(gateManagerAbi, pool.contractAddress);
        if (pool.boostRewardId !== undefined) {
            calls[pool.network].push({
                id: pool.id,
                awardBalance: gateContract.methods.awardBalance(),
                rewardRate: gateContract.methods.rewardRate(),
                totalValueLocked: gateContract.methods.TVL(),
                sponsorRewardInfo: gateContract.methods.rewardInfo(pool.sponsorRewardId),
                boostRewardInfo: gateContract.methods.rewardInfo(pool.boostRewardId),
            });
        } else if (pool.sponsorRewardId !== undefined) {
            calls[pool.network].push({
                id: pool.id,
                awardBalance: gateContract.methods.awardBalance(),
                rewardRate: gateContract.methods.rewardRate(),
                totalValueLocked: gateContract.methods.TVL(),
                sponsorRewardInfo: gateContract.methods.rewardInfo(pool.sponsorRewardId),
            });
        } else {
            calls[pool.network].push({
                id: pool.id,
                awardBalance: gateContract.methods.awardBalance(),
                rewardRate: gateContract.methods.rewardRate(),
                totalValueLocked: gateContract.methods.TVL(),
            });
        }

        const strategyContract = new web3[pool.network].eth.Contract(prizeStrategyAbi, pool.prizeStrategyAddress);
        strategy[pool.network].push({
            id: pool.id,
            expiresAt: strategyContract.methods.prizePeriodEndAt(),
            numberOfWinners: strategyContract.methods.numberOfWinners(),
        });

        const ticketContract = new web3[pool.network].eth.Contract(ecr20Abi, pool.rewardAddress);
        ticket[pool.network].push({
            id: pool.id,
            totalTickets: ticketContract.methods.totalSupply(),
        })

        if (!isEmpty(pool.sponsorAddress)) {
            const sponsorContract = new web3[pool.network].eth.Contract(ecr20Abi, pool.sponsorAddress);
            sponsors[pool.network].push({
                id: pool.id,
                sponsorBalance: sponsorContract.methods.balanceOf(pool.prizePoolAddress),
            });
        }
    }

    const promises = [];
    for (const key in multicall) {
        promises.push(multicall[key].all([calls[key]]));
        promises.push(multicall[key].all([strategy[key]]));
        promises.push(multicall[key].all([sponsors[key]]));
        promises.push(multicall[key].all([ticket[key]]));
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

    let totalPrizesAvailable = new BigNumber(0);

    for (let i = 0; i < response.length; i++) {
        const item = response[i];
        if (!isEmpty(item.awardBalance)) {
            const awardPrice = (pools[item.id].oracleId in prices) ? prices[pools[item.id].oracleId] : 0;
            const awardBalance = new BigNumber(item.awardBalance).times(new BigNumber(0.8)).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].tokenDecimals));
            const awardBalanceUsd = awardBalance.times(awardPrice);

            pools[item.id].awardBalance = awardBalance;
            pools[item.id].awardBalanceUsd = awardBalanceUsd;
            pools[item.id].apy = (!isEmpty(apy) && pools[item.id].apyId in apy) ? (new BigNumber(apy[pools[item.id].apyId].totalApy).times(100).div(2).toFixed(2)) : 0;

            const totalValueLocked = new BigNumber(item.totalValueLocked);
            const totalTokenStaked = byDecimals(totalValueLocked, pools[item.id].tokenDecimals);
            pools[item.id].totalTokenStaked = totalTokenStaked;
            pools[item.id].totalStakedUsd = totalValueLocked.times(awardPrice).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].tokenDecimals));
            pools[item.id].tvl = formatTvl(totalTokenStaked, awardPrice);

            if ('sponsorRewardInfo' in item) {
                const sponsorPrice = (pools[item.id].sponsorToken in prices) ? prices[pools[item.id].sponsorToken] : 0;
                const rewardRate = new BigNumber(item.sponsorRewardInfo ? item.sponsorRewardInfo['3'] : 0);
                const TotalValueLocked = new BigNumber(item.totalValueLocked);
                const totalStakedUsd = TotalValueLocked.times(awardPrice).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].sponsorTokenDecimals));
                const yearlyRewards = rewardRate.times(3600).times(24).times(365);
                const yearlyRewardsInUsd = yearlyRewards.times(sponsorPrice).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].sponsorTokenDecimals))

                let boostRewardsInUsd = new BigNumber(0)
                if (item.boostRewardInfo) {
                    const boostPrice = (pools[item.id].boostToken in prices) ? prices[pools[item.id].boostToken] : 0;
                    const rewardRate = new BigNumber(item.boostRewardInfo['3']);
                    const yearlyRewards = rewardRate.times(3600).times(24).times(365);
                    boostRewardsInUsd = yearlyRewards.times(boostPrice).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].boostTokenDecimals))
                }

                pools[item.id].bonusApy = Number(yearlyRewardsInUsd.plus(boostRewardsInUsd).multipliedBy(100).dividedBy(totalStakedUsd));
            } else if (!isEmpty(pools[item.id].sponsorToken)) {
                const sponsorPrice = (pools[item.id].sponsorToken in prices) ? prices[pools[item.id].sponsorToken] : 0;
                const rewardRate = new BigNumber(item.rewardRate);
                const TotalValueLocked = new BigNumber(item.totalValueLocked);
                const totalStakedUsd = TotalValueLocked.times(awardPrice).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].sponsorTokenDecimals));
                const yearlyRewards = rewardRate.times(3600).times(24).times(365);
                const yearlyRewardsInUsd = yearlyRewards.times(sponsorPrice).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].sponsorTokenDecimals))

                pools[item.id].bonusApy = Number(yearlyRewardsInUsd.multipliedBy(100).dividedBy(totalStakedUsd));
            }

            if (pools[item.id].status === 'active') {
                totalPrizesAvailable = totalPrizesAvailable.plus(awardBalanceUsd);
            }
        }

        if (!isEmpty(item.expiresAt)) {
            pools[item.id].expiresAt = item.expiresAt;
            pools[item.id].numberOfWinners = Number(item.numberOfWinners);
        }

        if (!isEmpty(item.totalTickets)) {
            pools[item.id].totalTickets = item.totalTickets;
        }

        if (!isEmpty(item.sponsorBalance)) {
            // TODO remove once POTS prize sent to contract
            if (item.id === 'cake' && BigNumber(item.sponsorBalance).isZero()) {
                item.sponsorBalance = BigNumber(40000).multipliedBy(new BigNumber(10).exponentiatedBy(pools[item.id].sponsorTokenDecimals));
            }
            // TODO End

            const sponsorPrice = (pools[item.id].sponsorToken in prices) ? prices[pools[item.id].sponsorToken] : 0;
            const sponsorBalance = new BigNumber(item.sponsorBalance).dividedBy(new BigNumber(10).exponentiatedBy(pools[item.id].sponsorTokenDecimals));
            const sponsorBalanceUsd = sponsorBalance.times(new BigNumber(sponsorPrice));

            pools[item.id].sponsorBalance = sponsorBalance;
            pools[item.id].sponsorBalanceUsd = sponsorBalanceUsd;

            if (pools[item.id].status === 'active') {
                totalPrizesAvailable = totalPrizesAvailable.plus(sponsorBalanceUsd);
            }
        }
    }

    dispatch({
        type: HOME_FETCH_POOLS_DONE,
        payload: {
            pools: pools,
            totalTvl: state.vaultReducer.totalTvl,
            totalPrizesAvailable: totalPrizesAvailable,
            isPoolsLoading: false,
            lastUpdated: new Date().getTime()
        }
    });

    return true;
}

const getPoolsSingle = async (item, state, dispatch) => {
    console.log('redux getPoolsSingle() processing...');
    return await getPools([item], state, dispatch);
}

const getPoolsAll = async (state, dispatch) => {
    console.log('redux getPoolsAll() processing...');
    const pools = state.vaultReducer.pools;
    return getPools(pools, state, dispatch)
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
