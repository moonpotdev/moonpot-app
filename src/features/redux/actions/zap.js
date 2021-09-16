import { ZAP_SWAP_ESTIMATE_COMPLETE, ZAP_SWAP_ESTIMATE_PENDING } from '../constants';
import uniqid from 'uniqid';
import { tokensByNetworkAddress } from '../../../config/tokens';
import zapAbi from '../../../config/abi/zap.json';
import { byDecimals, convertAmountToRawNumber } from '../../../helpers/format';
import { config } from '../../../config/config';

export function createZapInEstimate(potId, depositAddress, depositAmount) {
  const requestId = uniqid(potId);

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
          depositAddress,
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

const zapActions = { createZapInEstimate };

export default zapActions;
