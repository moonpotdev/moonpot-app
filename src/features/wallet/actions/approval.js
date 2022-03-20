import { WALLET_ACTION, WALLET_ACTION_RESET } from '../../redux/constants';
import { Web3 } from '../../../helpers/web3';
import { estimateGas } from './helpers';
import erc20Abi from '../../../config/abi/erc20.json';
import { getWalletWeb3 } from '../instances';

export const approval = (network, tokenAddr, spendingContractAddress) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = getWalletWeb3();

    if (address && web3) {
      const contract = new web3.eth.Contract(erc20Abi, tokenAddr);
      const maxAmount = Web3.utils.toWei('8000000000', 'ether');
      const method = contract.methods.approve(spendingContractAddress, maxAmount);
      const [estimateError, options] = await estimateGas(network, method, { from: address });

      if (estimateError) {
        dispatch({
          type: WALLET_ACTION,
          payload: {
            result: 'error',
            data: { spender: spendingContractAddress, error: estimateError },
          },
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
              data: { spender: spendingContractAddress, maxAmount: maxAmount, hash: hash },
            },
          });
        })
        .on('receipt', function (receipt) {
          dispatch({
            type: WALLET_ACTION,
            payload: {
              result: 'success',
              data: { spender: spendingContractAddress, maxAmount: maxAmount, receipt: receipt },
            },
          });
        })
        .on('error', function (error) {
          dispatch({
            type: WALLET_ACTION,
            payload: {
              result: 'error',
              data: { spender: spendingContractAddress, error: error.message },
            },
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
};
