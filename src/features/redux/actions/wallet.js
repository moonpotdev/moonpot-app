import { WALLET_ACTION, WALLET_ACTION_RESET } from '../constants';
import zapAbi from '../../../config/abi/zap.json';
import { convertAmountToRawNumber } from '../../../helpers/format';
import BigNumber from 'bignumber.js';
import { networkByKey } from '../../../config/networks';

const Web3 = require('web3');
const erc20Abi = require('../../../config/abi/erc20.json');
const gateManagerAbi = require('../../../config/abi/gatemanager.json');
const ziggyManagerMultiRewardsAbi = require('../../../config/abi/ziggyManagerMultiRewards.json');
const potsClaimerAbi = require('../../../config/abi/potsClaimer.json');

async function estimateGas(network, method, options) {
  let estimatedGasLimit = '0';

  try {
    estimatedGasLimit = await method.estimateGas(options);
  } catch (err) {
    console.error('cannot estimate gas,', err);
    return [err.reason || err.data?.message || err.message || 'Unknown failure', null];
  }

  const limit = new BigNumber(estimatedGasLimit || '0');
  if (limit.isNaN() || limit.lte(0)) {
    return ['Estimate was zero', null];
  }

  // Add 50%
  const limitWithMargin = limit.multipliedBy('15000').dividedToIntegerBy('10000').toNumber();

  return [null, { ...options, gas: limitWithMargin }];
}

const approval = (network, tokenAddr, spendingContractAddress) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = state.wallet.web3;

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

const deposit = (network, contractAddr, amount, max) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = state.wallet.web3;

    if (address && web3) {
      const contract = new web3.eth.Contract(gateManagerAbi, contractAddr);

      if (max) {
        const method = contract.methods.depositAll('0x0000000000000000000000000000000000000000');
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
        const method = contract.methods.depositMoonPot(
          amount,
          '0x0000000000000000000000000000000000000000'
        );
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

const withdraw = (network, contractAddr, amount, max) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = state.wallet.web3;

    if (address && web3) {
      const contract = new web3.eth.Contract(gateManagerAbi, contractAddr);

      if (max) {
        const method = contract.methods.exitInstantly();
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

const getReward = (network, contractAddr) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = state.wallet.web3;

    if (address && web3) {
      const contract = new web3.eth.Contract(gateManagerAbi, contractAddr);
      const method = contract.methods.getReward();
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

const compound = (network, contractAddr) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = state.wallet.web3;

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

const zapIn = (
  network,
  potAddress,
  { depositAmount, isNative, zapAddress, swapInToken, swapOutToken, swapOutAmount },
  isDepositAll
) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = state.wallet.web3;

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

const zapOut = (
  network,
  potAddress,
  { zapAddress, isRemoveOnly, userBalanceAfterFeeRaw, swapOutToken, swapOutAmount }
) => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const address = state.wallet.address;
    const web3 = state.wallet.web3;

    if (address && web3) {
      const contract = new web3.eth.Contract(zapAbi, zapAddress);

      // console.log(potAddress);
      // console.log(zapAddress);
      // console.log(address);
      // console.log(network);
      // console.log(isRemoveOnly);

      if (isRemoveOnly) {
        const method = contract.methods.beamOut(potAddress, true);
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

const claimAllBonuses = alsoClaimOtherTokens => {
  return async (dispatch, getState) => {
    dispatch({ type: WALLET_ACTION_RESET });
    const state = getState();
    const { address, network, web3 } = state.wallet;
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

const obj = {
  approval,
  deposit,
  withdraw,
  getReward,
  compound,
  zapIn,
  zapOut,
  claimAllBonuses,
};

export default obj;
