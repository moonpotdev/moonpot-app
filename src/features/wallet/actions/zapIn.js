import { WALLET_ACTION, WALLET_ACTION_RESET } from '../../redux/constants';
import { estimateGas } from './helpers';
import { convertAmountToRawNumber } from '../../../helpers/format';
import zapAbi from '../../../config/abi/zap.json';
import { getWalletWeb3 } from '../instances';

export const zapIn = (
  network,
  potAddress,
  { depositAmount, isNative, zapAddress, swapInToken, swapOutToken, swapOutAmount },
  isDepositAll
) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = getWalletWeb3();

    if (address && web3) {
      const contract = new web3.eth.Contract(zapAbi, zapAddress);
      const depositAmountRaw = convertAmountToRawNumber(depositAmount, swapInToken.decimals);
      const tokenAmountOutMinRaw = convertAmountToRawNumber(
        swapOutAmount.multipliedBy(0.99),
        swapOutToken.decimals
      );

      // console.log(tokenAmountOutMinRaw);

      if (isNative) {
        const method = contract.methods.beamInETH(potAddress, tokenAmountOutMinRaw);
        const [estimateError, options] = await estimateGas(network, method, {
          from: address,
          value: depositAmountRaw,
        });

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
                data: { spender: zapAddress, amount: depositAmountRaw, hash: hash },
              },
            });
          })
          .on('receipt', function (receipt) {
            dispatch({
              type: WALLET_ACTION,
              payload: {
                result: 'success',
                data: { spender: zapAddress, amount: depositAmountRaw, receipt: receipt },
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
        const method = contract.methods.beamIn(
          potAddress,
          tokenAmountOutMinRaw,
          swapInToken.address,
          depositAmountRaw
        );
        const [estimateError, options] = await estimateGas(network, method, { from: address });

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
                data: { spender: zapAddress, amount: depositAmountRaw, hash: hash },
              },
            });
          })
          .on('receipt', function (receipt) {
            dispatch({
              type: WALLET_ACTION,
              payload: {
                result: 'success',
                data: { spender: zapAddress, amount: depositAmountRaw, receipt: receipt },
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
