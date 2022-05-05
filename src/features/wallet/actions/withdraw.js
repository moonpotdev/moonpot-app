import { WALLET_ACTION, WALLET_ACTION_RESET } from '../../redux/constants';
import { estimateGas } from './helpers';
import gateManagerAbi from '../../../config/abi/gatemanager.json';
import { getWalletWeb3 } from '../instances';

export const withdraw = (network, contractAddr, amount, max) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = getWalletWeb3();

    if (address && web3) {
      const contract = new web3.eth.Contract(gateManagerAbi, contractAddr);

      if (max) {
        const method = contract.methods.exitInstantly();
        const [estimateError, options] = await estimateGas(web3, method, { from: address });

        if (estimateError) {
          dispatch({
            type: WALLET_ACTION,
            payload: { result: 'error', data: { spender: contractAddr, error: estimateError } },
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
                data: { spender: contractAddr, amount: amount, hash: hash },
              },
            });
          })
          .on('receipt', function (receipt) {
            dispatch({
              type: WALLET_ACTION,
              payload: {
                result: 'success',
                data: { spender: contractAddr, amount: amount, receipt: receipt },
              },
            });
          })
          .on('error', function (error) {
            dispatch({
              type: WALLET_ACTION,
              payload: { result: 'error', data: { spender: contractAddr, error: error.message } },
            });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        const method = contract.methods.withdrawInstantlyFromMoonPotPrizePool(amount);
        const [estimateError, options] = await estimateGas(web3, method, { from: address });

        if (estimateError) {
          dispatch({
            type: WALLET_ACTION,
            payload: { result: 'error', data: { spender: contractAddr, error: estimateError } },
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
                data: { spender: contractAddr, amount: amount, hash: hash },
              },
            });
          })
          .on('receipt', function (receipt) {
            dispatch({
              type: WALLET_ACTION,
              payload: {
                result: 'success',
                data: { spender: contractAddr, amount: amount, receipt: receipt },
              },
            });
          })
          .on('error', function (error) {
            dispatch({
              type: WALLET_ACTION,
              payload: { result: 'error', data: { spender: contractAddr, error: error.message } },
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };
};
