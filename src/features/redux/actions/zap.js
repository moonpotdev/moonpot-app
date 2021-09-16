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

      const userBalanceRaw = new BigNumber(userTotalBalance)
        .times(new BigNumber('10').pow(pot.tokenDecimals))
        .decimalPlaces(0, BigNumber.ROUND_DOWN);
      const totalSupply = new BigNumber(await pairContract.methods.totalSupply().call());
      const reserves = await pairContract.methods.getReserves().call();
      const balance0 = userBalanceRaw.dividedBy(totalSupply).multipliedBy(reserves[0]);
      const balance1 = userBalanceRaw.dividedBy(totalSupply).multipliedBy(reserves[1]);

      console.log(
        byDecimals(userBalanceRaw, pot.decimals).toString(),
        'lp',
        byDecimals(balance0, token0.decimals).toString(),
        token0.symbol,
        byDecimals(balance1, token1.decimals).toString(),
        token1.symbol
      );

      if (isRemoveOnly) {
        // withdraw lp from pot and withdraw tokens from lp as-is
        console.log('remove liq only');
        dispatch({
          type: ZAP_SWAP_ESTIMATE_COMPLETE,
          payload: {
            requestId,
            potId,
            isRemoveOnly,
            zapAddress: pairToken.zap,
            token0,
            token1,
            balance0: byDecimals(balance0, token0.decimals),
            balance1: byDecimals(balance0, token0.decimals),
          },
        });
      } else {
        const swapInToken =
          wantTokenAddress.toLowerCase() === token0.address.toLowerCase() ? token0 : token1;
        const swapOutToken =
          wantTokenAddress.toLowerCase() === token0.address.toLowerCase() ? token1 : token0;

        const inputAmountRaw = (
          wantTokenAddress.toLowerCase() === token0.address.toLowerCase() ? balance0 : balance1
        )
          .decimalPlaces(0, BigNumber.ROUND_DOWN)
          .toString(10);
        // const pairContract = new web3.eth.Contract(pairAbi, pairToken.address);

        // out[0] === input amount, out[1] === output amount
        const out = await routerContract.methods
          .getAmountsOut(inputAmountRaw, [swapInToken.address, swapOutToken.address])
          .call();

        const outputAmountRaw = out[1];

        console.log(
          'swap',
          byDecimals(inputAmountRaw, swapInToken.decimals).toNumber(),
          swapInToken.symbol,
          byDecimals(outputAmountRaw, swapOutToken.decimals).toNumber(),
          swapOutToken.symbol
        );

        dispatch({
          type: ZAP_SWAP_ESTIMATE_COMPLETE,
          payload: {
            requestId,
            potId,
            isRemoveOnly,
            zapAddress: pairToken.zap,
            token0,
            token1,
            swapOutToken,
            balance0: byDecimals(balance0, token0.decimals),
            balance1: byDecimals(balance0, token0.decimals),
            swapOutAmount: byDecimals(outputAmountRaw, swapOutToken.decimals),
          },
        });
      }
    },
  ];
}

const zapActions = { createZapInEstimate, createZapOutEstimate };

export default zapActions;
