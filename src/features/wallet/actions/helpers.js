import { BigNumber } from 'bignumber.js';

export async function estimateGas(network, method, options) {
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
