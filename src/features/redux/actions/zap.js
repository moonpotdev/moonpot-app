import uniqid from 'uniqid';
import BigNumber from 'bignumber.js';
import { ZAP_SWAP_ESTIMATE_COMPLETE, ZAP_SWAP_ESTIMATE_PENDING } from '../constants';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../../config/tokens';
import zapAbi from '../../../config/abi/zap.json';
import routerAbi from '../../../config/abi/router.json';
import pairAbi from '../../../config/abi/pair.json';
import prizePoolAbi from '../../../config/abi/prizepool.json';
import erc20Abi from '../../../config/abi/erc20.json';
import { byDecimals, convertAmountToRawNumber } from '../../../helpers/format';
import { config } from '../../../config/config';
import gateManagerAbi from '../../../config/abi/gatemanager.json';
import { MultiCall } from 'eth-multicall';
import { getFairplayFeePercent, objectArrayFlatten } from '../../../helpers/utils';

function fakeZapInEstimate(potId, depositAddress, depositAmount) {
  const requestId = uniqid('in', potId);

  return [
    requestId,
    async (dispatch, getState) => {
      dispatch({
        type: ZAP_SWAP_ESTIMATE_PENDING,
        payload: {
          requestId,
          potId,
          depositAddress,
          depositAmount,
        },
      });

      const state = getState();
      const pot = state.vaultReducer.pools[potId];
      const network = pot.network;
      const wrappedNative = config[network].nativeCurrency.wrappedAddress;
      const pairToken = tokensByNetworkAddress[network][pot.tokenAddress.toLowerCase()];
      const isNative = !depositAddress;
      const swapInToken = isNative
        ? tokensByNetworkAddress[network][wrappedNative.toLowerCase()]
        : tokensByNetworkAddress[network][depositAddress.toLowerCase()];

      dispatch({
        type: ZAP_SWAP_ESTIMATE_COMPLETE,
        payload: {
          requestId,
          potId,
          isNative,
          zapAddress: pairToken.zap,
          swapInAddress: swapInToken.address,
          swapInToken,
          swapInAmount: depositAmount,
          swapOutAddress: pairToken.address,
          swapOutToken: pairToken,
          swapOutAmount: byDecimals(1, pairToken.decimals, true),
        },
      });
    },
  ];
}

export function createZapInEstimate(potId, depositAddress, depositAmount) {
  if (potId === 'beltbnb') {
    return fakeZapInEstimate(potId, depositAddress, depositAmount);
  }

  const requestId = uniqid('in', potId);

  return [
    requestId,
    async (dispatch, getState) => {
      dispatch({
        type: ZAP_SWAP_ESTIMATE_PENDING,
        payload: {
          requestId,
          potId,
          depositAddress,
          depositAmount,
        },
      });

      const state = getState();
      const pot = state.vaultReducer.pools[potId];
      const network = pot.network;
      const web3 = state.walletReducer.rpc[network];
      const wrappedNative = config[network].nativeCurrency.wrappedAddress;
      const pairToken = tokensByNetworkAddress[network][pot.tokenAddress.toLowerCase()];
      const isNative = !depositAddress;
      const swapInToken = isNative
        ? tokensByNetworkAddress[network][wrappedNative.toLowerCase()]
        : tokensByNetworkAddress[network][depositAddress.toLowerCase()];
      const zapContract = new web3.eth.Contract(zapAbi, pairToken.zap);

      const result = await zapContract.methods
        .estimateSwap(
          pot.contractAddress,
          swapInToken.address,
          convertAmountToRawNumber(depositAmount, swapInToken.decimals)
        )
        .call();

      const swapOutToken = tokensByNetworkAddress[network][result.swapTokenOut.toLowerCase()];

      dispatch({
        type: ZAP_SWAP_ESTIMATE_COMPLETE,
        payload: {
          requestId,
          potId,
          isNative,
          zapAddress: pairToken.zap,
          swapInAddress: swapInToken.address,
          swapInToken,
          swapInAmount: byDecimals(result.swapAmountIn, swapInToken.decimals, true),
          swapOutAddress: swapOutToken.address,
          swapOutToken,
          swapOutAmount: byDecimals(result.swapAmountOut, swapOutToken.decimals, true),
        },
      });
    },
  ];
}

function fakeZapOutEstimate(potId, wantTokenAddress) {
  const requestId = uniqid('out', potId);

  return [
    requestId,
    async (dispatch, getState) => {
      dispatch({
        type: ZAP_SWAP_ESTIMATE_PENDING,
        payload: {
          requestId,
          potId,
          wantTokenAddress,
        },
      });

      const state = getState();
      const pot = state.vaultReducer.pools[potId];
      const withdrawFee = 'withdrawFee' in pot ? pot.withdrawFee : 0;
      const network = pot.network;
      const web3 = state.walletReducer.rpc[network];
      const multicall = new MultiCall(web3, config[network].multicallAddress);
      const address = state.walletReducer.address;
      const isRemoveOnly = potId === 'beltbnb';
      const fairplayDuration = pot.fairplayDuration;
      const fairplayTicketFee = pot.fairplayTicketFee;
      const pairToken = tokensByNetworkAddress[network][pot.tokenAddress.toLowerCase()];
      const wantToken = tokensByNetworkAddress[network][wantTokenAddress.toLowerCase()];
      const token0Symbol = pairToken.lp[0];
      const token1Symbol = pairToken.lp.length > 1 ? pairToken.lp[1] : pairToken.lp[0];
      const token0 = tokensByNetworkSymbol[network][token0Symbol];
      const token1 = tokensByNetworkSymbol[network][token1Symbol];
      const ticketContract = new web3.eth.Contract(erc20Abi, pot.rewardAddress);
      const gateContract = new web3.eth.Contract(gateManagerAbi, pot.contractAddress);
      const prizePoolContract = new web3.eth.Contract(prizePoolAbi, pot.prizePoolAddress);

      const calls = [
        {
          ticketBalance: ticketContract.methods.balanceOf(address),
        },
        {
          timeleft: prizePoolContract.methods.userFairPlayLockRemaining(address, pot.rewardAddress),
        },
        {
          userTotalBalance: gateContract.methods.userTotalBalance(address),
        },
      ];

      const [results] = await multicall.all([calls]);
      const { ticketBalance, timeleft, userTotalBalance } = objectArrayFlatten(results);

      const fairplayFee = getFairplayFeePercent(timeleft, fairplayDuration, fairplayTicketFee);

      const depositBalance = new BigNumber(userTotalBalance).minus(ticketBalance);
      const ticketBalanceAfterWithdrawFee = new BigNumber(ticketBalance).multipliedBy(
        1 - withdrawFee
      );
      const depositBalanceAfterWithdrawFee = depositBalance.multipliedBy(1 - withdrawFee);
      const ticketBalanceAfterFairplayFee = ticketBalanceAfterWithdrawFee.multipliedBy(
        1 - fairplayFee
      );
      const userWithdrawableBalance = depositBalanceAfterWithdrawFee
        .plus(ticketBalanceAfterFairplayFee)
        .decimalPlaces(0, BigNumber.ROUND_DOWN);

      const balance0 = '1';
      const balance1 = '1';
      const swapInToken = pairToken;
      const swapOutToken = wantToken;
      const swapInAmountRaw = '1';
      const swapOutAmountRaw = '1';

      dispatch({
        type: ZAP_SWAP_ESTIMATE_COMPLETE,
        payload: {
          requestId,
          potId,
          isRemoveOnly,
          zapAddress: pairToken.zap,
          userTotalBalance: byDecimals(userTotalBalance, pot.tokenDecimals, true),
          userWithdrawableBalance: byDecimals(userWithdrawableBalance, pot.tokenDecimals, true),
          token0,
          token1,
          balance0: byDecimals(balance0, token0.decimals, true),
          balance1: byDecimals(balance1, token1.decimals, true),
          swapInToken,
          swapOutToken,
          swapInAmount: byDecimals(swapInAmountRaw, swapInToken.decimals, true),
          swapOutAmount: byDecimals(swapOutAmountRaw, swapOutToken.decimals, true),
        },
      });
    },
  ];
}

export function createZapOutEstimate(potId, wantTokenAddress) {
  if (potId === '4belt' || potId === 'beltbnb') {
    return fakeZapOutEstimate(potId, wantTokenAddress);
  }
  const requestId = uniqid('out', potId);

  return [
    requestId,
    async (dispatch, getState) => {
      dispatch({
        type: ZAP_SWAP_ESTIMATE_PENDING,
        payload: {
          requestId,
          potId,
          wantTokenAddress,
        },
      });

      const state = getState();
      const pot = state.vaultReducer.pools[potId];
      const withdrawFee = 'withdrawFee' in pot ? pot.withdrawFee : 0;
      const network = pot.network;
      const web3 = state.walletReducer.rpc[network];
      const multicall = new MultiCall(web3, config[network].multicallAddress);
      const address = state.walletReducer.address;
      const isRemoveOnly = !wantTokenAddress;
      const fairplayDuration = pot.fairplayDuration;
      const fairplayTicketFee = pot.fairplayTicketFee;
      const pairToken = tokensByNetworkAddress[network][pot.tokenAddress.toLowerCase()];
      const token0Symbol = pairToken.lp[0];
      const token1Symbol = pairToken.lp[1];
      const token0 = tokensByNetworkSymbol[network][token0Symbol];
      const token1 = tokensByNetworkSymbol[network][token1Symbol];
      const zapContract = new web3.eth.Contract(zapAbi, pairToken.zap);
      const pairContract = new web3.eth.Contract(pairAbi, pairToken.address);
      const ticketContract = new web3.eth.Contract(erc20Abi, pot.rewardAddress);
      const gateContract = new web3.eth.Contract(gateManagerAbi, pot.contractAddress);
      const prizePoolContract = new web3.eth.Contract(prizePoolAbi, pot.prizePoolAddress);

      const calls = [
        {
          ticketBalance: ticketContract.methods.balanceOf(address),
        },
        {
          totalSupply: pairContract.methods.totalSupply(),
          reserves: pairContract.methods.getReserves(),
        },
        {
          timeleft: prizePoolContract.methods.userFairPlayLockRemaining(address, pot.rewardAddress),
        },
        {
          userTotalBalance: gateContract.methods.userTotalBalance(address),
        },
        {
          routerAddress: zapContract.methods.router(),
        },
      ];

      const [results] = await multicall.all([calls]);
      const { ticketBalance, totalSupply, reserves, timeleft, userTotalBalance, routerAddress } =
        objectArrayFlatten(results);

      const fairplayFee = getFairplayFeePercent(timeleft, fairplayDuration, fairplayTicketFee);

      const depositBalance = new BigNumber(userTotalBalance).minus(ticketBalance);
      const ticketBalanceAfterWithdrawFee = new BigNumber(ticketBalance).multipliedBy(
        1 - withdrawFee
      );
      const depositBalanceAfterWithdrawFee = depositBalance.multipliedBy(1 - withdrawFee);
      const ticketBalanceAfterFairplayFee = ticketBalanceAfterWithdrawFee.multipliedBy(
        1 - fairplayFee
      );
      const userWithdrawableBalance = depositBalanceAfterWithdrawFee
        .plus(ticketBalanceAfterFairplayFee)
        .decimalPlaces(0, BigNumber.ROUND_DOWN);

      /*console.log('zap out estimate inputs', {
        userTotalBalance: byDecimals(userTotalBalance, 18).toString(),
        ticketBalance: byDecimals(ticketBalance, 18).toString(),
        depositBalance: byDecimals(depositBalance, 18).toString(),
        ticketBalanceAfterWithdrawFee: byDecimals(ticketBalanceAfterWithdrawFee, 18).toString(),
        depositBalanceAfterWithdrawFee: byDecimals(depositBalanceAfterWithdrawFee, 18).toString(),
        ticketBalanceAfterFairplayFee: byDecimals(ticketBalanceAfterFairplayFee, 18).toString(),
        userWithdrawableBalance: byDecimals(userWithdrawableBalance, 18).toString(),
        withdrawFee: withdrawFee * 100 + '%',
        withdrawFeeTokens: byDecimals(
          new BigNumber(userTotalBalance).multipliedBy(withdrawFee),
          18
        ).toString(),
        fairplayFee: fairplayFee * 100 + '%',
        fairplayFeeTokens: byDecimals(
          new BigNumber(ticketBalance).multipliedBy(fairplayFee),
          18
        ).toString(),

        rawUserTotalBalance: userTotalBalance.toString(),
        rawTicketBalance: ticketBalance.toString(),
        rawDepositBalance: depositBalance.toString(),
        rawTicketBalanceAfterWithdrawFee: ticketBalanceAfterWithdrawFee.toString(),
        rawDepositBalanceAfterWithdrawFee: depositBalanceAfterWithdrawFee.toString(),
        rawTicketBalanceAfterFairplayFee: ticketBalanceAfterFairplayFee.toString(),
        rawUserWithdrawableBalance: userWithdrawableBalance.toString(),
        rawWithdrawFeeTokens: new BigNumber(userTotalBalance).multipliedBy(withdrawFee).toString(),
        rawFairplayFeeTokens: new BigNumber(ticketBalance).multipliedBy(fairplayFee).toString(),
      });*/

      const balance0 = userWithdrawableBalance
        .multipliedBy(reserves[0])
        .dividedBy(totalSupply)
        .decimalPlaces(0, BigNumber.ROUND_DOWN)
        .toString(10);

      const balance1 = userWithdrawableBalance
        .multipliedBy(reserves[1])
        .dividedBy(totalSupply)
        .decimalPlaces(0, BigNumber.ROUND_DOWN)
        .toString(10);

      if (isRemoveOnly) {
        // console.log('zap out', 'is remove only');
        // withdraw lp from pot and withdraw tokens from lp as-is
        dispatch({
          type: ZAP_SWAP_ESTIMATE_COMPLETE,
          payload: {
            requestId,
            potId,
            isRemoveOnly,
            zapAddress: pairToken.zap,
            userTotalBalance: byDecimals(userTotalBalance, pot.tokenDecimals, true),
            userWithdrawableBalance: byDecimals(userWithdrawableBalance, pot.tokenDecimals, true),
            token0,
            token1,
            balance0: byDecimals(balance0, token0.decimals, true),
            balance1: byDecimals(balance1, token1.decimals, true),
          },
        });
      } else {
        // console.log('zap out', 'remove and swap');
        // withdraw lp and swap one half
        const routerContract = new web3.eth.Contract(routerAbi, routerAddress);
        const wantIsToken0 = wantTokenAddress.toLowerCase() === token0.address.toLowerCase();
        const swapInToken = wantIsToken0 ? token1 : token0;
        const swapInReservesRaw = wantIsToken0 ? reserves[1] : reserves[0];
        const swapInAmountRaw = wantIsToken0 ? balance1 : balance0;
        const swapOutToken = wantIsToken0 ? token0 : token1;
        const swapOutReservesRaw = wantIsToken0 ? reserves[0] : reserves[1];

        // console.log('zap out swap call', {
        //   swapInAmountRaw,
        //   swapInReservesRaw,
        //   swapOutReservesRaw,
        // });

        const swapOutAmountRaw = await routerContract.methods
          .getAmountOut(swapInAmountRaw, swapInReservesRaw, swapOutReservesRaw)
          .call();

        dispatch({
          type: ZAP_SWAP_ESTIMATE_COMPLETE,
          payload: {
            requestId,
            potId,
            isRemoveOnly,
            zapAddress: pairToken.zap,
            userTotalBalance: byDecimals(userTotalBalance, pot.tokenDecimals, true),
            userWithdrawableBalance: byDecimals(userWithdrawableBalance, pot.tokenDecimals, true),
            token0,
            token1,
            balance0: byDecimals(balance0, token0.decimals, true),
            balance1: byDecimals(balance1, token1.decimals, true),
            swapInToken,
            swapOutToken,
            swapInAmount: byDecimals(swapInAmountRaw, swapInToken.decimals, true),
            swapOutAmount: byDecimals(swapOutAmountRaw, swapOutToken.decimals, true),
          },
        });
      }
    },
  ];
}

const zapActions = { createZapInEstimate, createZapOutEstimate };

export default zapActions;
