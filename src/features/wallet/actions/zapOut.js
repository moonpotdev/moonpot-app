import { WALLET_ACTION, WALLET_ACTION_RESET } from '../../redux/constants';
import { estimateGas } from './helpers';
import { convertAmountToRawNumber } from '../../../helpers/format';
import zapAbi from '../../../config/abi/zap.json';
import { getWalletWeb3 } from '../instances';

export const zapOut = (
  network,
  potAddress,
  { zapAddress, isRemoveOnly, userBalanceAfterFeeRaw, swapOutToken, swapOutAmount }
) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = getWalletWeb3();

    if (address && web3) {
      const contract = new web3.eth.Contract(zapAbi, zapAddress);

      // console.log(potAddress);
      // console.log(zapAddress);
      // console.log(address);
      // console.log(network);
      // console.log(isRemoveOnly);

      if (isRemoveOnly) {
        const method = contract.methods.beamOut(potAddress, true);
        const [estimateError, options] = await estimateGas(web3, method, { from: address });

        if (estimateError) {
          dispatch({
            type: WALLET_ACTION,
            payload: { result: 'error', data: { spender: zapAddress, error: estimateError } },
          });
          return;
        }

        method
          .send(options)
          .on('transactionHash', function (hash) {
            dispatch({
              type: WALLET_ACTION,
              payload: {
                result: 'success_pending',
                data: { spender: zapAddress, amount: userBalanceAfterFeeRaw, hash: hash },
              },
            });
          })
          .on('receipt', function (receipt) {
            dispatch({
              type: WALLET_ACTION,
              payload: {
                result: 'success',
                data: { spender: zapAddress, amount: userBalanceAfterFeeRaw, receipt: receipt },
              },
            });
          })
          .on('error', function (error) {
            dispatch({
              type: WALLET_ACTION,
              payload: { result: 'error', data: { spender: zapAddress, error: error.message } },
            });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        const swapOutAmountMinRaw = convertAmountToRawNumber(
          swapOutAmount.multipliedBy(0.99),
          swapOutToken.decimals
        );

        // console.log(
        //   'beamOutAndSwap(',
        //   potAddress,
        //   swapOutToken.address,
        //   swapOutAmountMinRaw,
        //   true,
        //   ')',
        //   swapOutAmount.toString(),
        //   byDecimals(swapOutAmountMinRaw, swapOutToken.decimals).toString()
        // );

        const method = contract.methods.beamOutAndSwap(
          potAddress,
          swapOutToken.address,
          swapOutAmountMinRaw,
          true
        );
        const [estimateError, options] = await estimateGas(web3, method, { from: address });

        if (estimateError) {
          dispatch({
            type: WALLET_ACTION,
            payload: { result: 'error', data: { spender: zapAddress, error: estimateError } },
          });
          return;
        }

        method
          .send(options)
          .on('transactionHash', function (hash) {
            dispatch({
              type: WALLET_ACTION,
              payload: {
                result: 'success_pending',
                data: { spender: zapAddress, amount: userBalanceAfterFeeRaw, hash: hash },
              },
            });
          })
          .on('receipt', function (receipt) {
            dispatch({
              type: WALLET_ACTION,
              payload: {
                result: 'success',
                data: { spender: zapAddress, amount: userBalanceAfterFeeRaw, receipt: receipt },
              },
            });
          })
          .on('error', function (error) {
            dispatch({
              type: WALLET_ACTION,
              payload: { result: 'error', data: { spender: zapAddress, error: error.message } },
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };
};
