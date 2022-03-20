import { WALLET_ACTION, WALLET_ACTION_RESET } from '../../redux/constants';
import { estimateGas } from './helpers';
import ziggyManagerMultiRewardsAbi from '../../../config/abi/ziggyManagerMultiRewards.json';
import { getWalletWeb3 } from '../instances';

export const compound = (network, contractAddr) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = getWalletWeb3();

    if (address && web3) {
      const contract = new web3.eth.Contract(ziggyManagerMultiRewardsAbi, contractAddr);
      const method = contract.methods.compound();
      const [estimateError, options] = await estimateGas(network, method, { from: address });

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
            payload: { result: 'success_pending', data: { spender: contractAddr, hash: hash } },
          });
        })
        .on('receipt', function (receipt) {
          dispatch({
            type: WALLET_ACTION,
            payload: { result: 'success', data: { spender: contractAddr, receipt: receipt } },
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
  };
};
