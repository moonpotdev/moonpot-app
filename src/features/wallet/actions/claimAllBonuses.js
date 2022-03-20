import { WALLET_ACTION, WALLET_ACTION_RESET } from '../../redux/constants';
import { estimateGas } from './helpers';
import potsClaimerAbi from '../../../config/abi/potsClaimer.json';
import { networkByKey } from '../../../config/networks';
import { getWalletWeb3 } from '../instances';

export const claimAllBonuses = alsoClaimOtherTokens => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const { address, network } = state.wallet;
    const web3 = getWalletWeb3();
    const contractAddress = networkByKey[network].claimAllBonusesAddress;

    if (network && address && contractAddress && web3) {
      const contract = new web3.eth.Contract(potsClaimerAbi, contractAddress);

      const method = alsoClaimOtherTokens
        ? contract.methods.claimAll()
        : contract.methods.claimAllPots();
      const [estimateError, options] = await estimateGas(network, method, { from: address });

      if (estimateError) {
        dispatch({
          type: WALLET_ACTION,
          payload: { result: 'error', data: { spender: contractAddress, error: estimateError } },
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
              data: { spender: contractAddress, amount: 0, hash: hash },
            },
          });
        })
        .on('receipt', function (receipt) {
          dispatch({
            type: WALLET_ACTION,
            payload: {
              result: 'success',
              data: { spender: contractAddress, amount: 0, receipt: receipt },
            },
          });
        })
        .on('error', function (error) {
          dispatch({
            type: WALLET_ACTION,
            payload: { result: 'error', data: { spender: contractAddress, error: error.message } },
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
};
