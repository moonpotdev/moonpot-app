import { ZAP_SWAP_ESTIMATE_COMPLETE, ZAP_SWAP_ESTIMATE_PENDING } from '../constants';
import uniqid from 'uniqid';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../../config/tokens';
import zapAbi from '../../../config/abi/zap.json';
import routerAbi from '../../../config/abi/router.json';
import pairAbi from '../../../config/abi/pair.json';
import { byDecimals, convertAmountToRawNumber } from '../../../helpers/format';
import { config } from '../../../config/config';
import BigNumber from 'bignumber.js';

export function createZapInEstimate(potId, depositAddress, depositAmount) {
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
          swapInAmount: byDecimals(result.swapAmountIn, swapInToken.decimals),
          swapOutAddress: swapOutToken.address,
          swapOutToken,
          swapOutAmount: byDecimals(result.swapAmountOut, swapOutToken.decimals),
        },
      });
    },
  ];
}

export function createZapOutEstimate(potId, wantTokenAddress, userTotalBalance) {
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
          userTotalBalance,
        },
      });

      const state = getState();
      const pot = state.vaultReducer.pools[potId];
      const network = pot.network;
      const web3 = state.walletReducer.rpc[network];
      const isRemoveOnly = !wantTokenAddress;
      const pairToken = tokensByNetworkAddress[network][pot.tokenAddress.toLowerCase()];
      const token0Symbol = pairToken.lp[0];
      const token1Symbol = pairToken.lp[1];
      const token0 = tokensByNetworkSymbol[network][token0Symbol];
      const token1 = tokensByNetworkSymbol[network][token1Symbol];
      const zapContract = new web3.eth.Contract(zapAbi, pairToken.zap);
      const routerAddress = await zapContract.methods.router().call();
      const routerContract = new web3.eth.Contract(routerAbi, routerAddress);
      const pairContract = new web3.eth.Contract(pairAbi, pairToken.address);

      // TODO get withdraw fee and remove from userTotalBalance

      const userBalanceRaw = new BigNumber(userTotalBalance)
        .times(new BigNumber('10').pow(pot.tokenDecimals))
        .decimalPlaces(0, BigNumber.ROUND_DOWN);
      const totalSupplyRaw = new BigNumber(await pairContract.methods.totalSupply().call());
      const reservesRaw = await pairContract.methods.getReserves().call();
      const balance0raw = userBalanceRaw
        .dividedBy(totalSupplyRaw)
        .multipliedBy(reservesRaw[0])
        .decimalPlaces(0, BigNumber.ROUND_DOWN);
      const balance1raw = userBalanceRaw
        .dividedBy(totalSupplyRaw)
        .multipliedBy(reservesRaw[1])
        .decimalPlaces(0, BigNumber.ROUND_DOWN);

      console.log(
        byDecimals(userBalanceRaw, pot.decimals).toString(),
        'lp',
        byDecimals(balance0raw, token0.decimals).toString(),
        token0.symbol,
        byDecimals(balance1raw, token1.decimals).toString(),
        token1.symbol
      );

      if (isRemoveOnly) {
        // withdraw lp from pot and withdraw tokens from lp as-is
        dispatch({
          type: ZAP_SWAP_ESTIMATE_COMPLETE,
          payload: {
            requestId,
            potId,
            isRemoveOnly,
            zapAddress: pairToken.zap,
            userBalanceRaw,
            token0,
            token1,
            balance0: byDecimals(balance0raw, token0.decimals),
            balance1: byDecimals(balance1raw, token1.decimals),
          },
        });
      } else {
        // withdraw lp and swap one half
        const wantIsToken0 = wantTokenAddress.toLowerCase() === token0.address.toLowerCase();
        const swapInToken = wantIsToken0 ? token1 : token0;
        const swapInReservesRaw = wantIsToken0 ? reservesRaw[1] : reservesRaw[0];
        const swapInAmountRaw = wantIsToken0 ? balance1raw : balance0raw;
        const swapOutToken = wantIsToken0 ? token0 : token1;
        const swapOutReservesRaw = wantIsToken0 ? reservesRaw[0] : reservesRaw[1];

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
            userBalanceRaw,
            token0,
            token1,
            swapInToken,
            swapOutToken,
            balance0: byDecimals(balance0raw, token0.decimals),
            balance1: byDecimals(balance1raw, token1.decimals),
            swapInAmount: byDecimals(swapInAmountRaw, swapInToken.decimals),
            swapOutAmount: byDecimals(swapOutAmountRaw, swapOutToken.decimals),
          },
        });
      }
    },
  ];
}

const zapActions = { createZapInEstimate, createZapOutEstimate };

export default zapActions;
