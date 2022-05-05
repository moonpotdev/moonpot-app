import { BigNumber } from 'bignumber.js';
import { FeeHistoryResult } from 'web3-eth';
import { maybeHexToNumber, medianOf } from '../../../helpers/utils';
import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';

function getErrorMessage(err: unknown): string {
  if (err) {
    if (err instanceof Error) {
      return err.message;
    } else if (typeof err === 'string') {
      return err;
    } else if (typeof err === 'object' || typeof err === 'number') {
      return err.toString();
    }
  }

  return 'Unknown error';
}

/**
 * Formats data to per-block object, and converts hex strings to BigNumber instances
 */
function formatFeeHistory(history: FeeHistoryResult) {
  const oldestBlock = maybeHexToNumber(history.oldestBlock);
  const blocks = [];

  for (let i = 0; i < history.gasUsedRatio.length; ++i) {
    blocks.push({
      blockNo: oldestBlock + i,
      gasUsedRatio: history.gasUsedRatio[i],
      baseFeePerGas: new BigNumber(history.baseFeePerGas[i]),
      priorityFeePerGas: history.reward[i].map(reward => new BigNumber(reward)),
    });
  }

  return blocks;
}

/**
 * Helper method to format the return value of web3.eth.getFeeHistory
 */
async function getFeeHistory(
  web3: Web3,
  blockCount: number,
  lastBlock: number,
  percentiles: number[]
) {
  return formatFeeHistory(await web3.eth.getFeeHistory(blockCount, lastBlock, percentiles));
}

async function estimatePriorityGasFee(web3: Web3, blockNumber: number): Promise<BigNumber> {
  try {
    // Attempt to use median of last 5 blocks priority fees
    const feeHistory = await getFeeHistory(web3, 5, blockNumber, [20]);
    const priorityFees = feeHistory.map(block => block.priorityFeePerGas[0]);
    return medianOf(priorityFees);
  } catch (err) {
    // Fallback to using legacy gas price; NOTE this will overpay
    console.warn('EIP-1559 network without eth_feeHistory support.', err);
    return new BigNumber(await web3.eth.getGasPrice());
  }
}

export async function estimateGasLimit(
  method: any,
  options: TransactionConfig
): Promise<[string | null, TransactionConfig | null]> {
  let estimatedGasLimit = '0';

  try {
    estimatedGasLimit = await method.estimateGas(options);
  } catch (err) {
    console.error('cannot estimate gas limit,', err);
    return [`estimateGasLimit: ${getErrorMessage(err)}`, null];
  }

  const limit = new BigNumber(estimatedGasLimit || '0');
  if (limit.isNaN() || limit.lte(0)) {
    return ['estimateGasLimit: Estimate was zero', null];
  }

  // Add 50%
  const limitWithMargin = limit.multipliedBy('15000').dividedToIntegerBy('10000').toNumber();

  return [null, { gas: limitWithMargin }];
}

export async function estimateGasPrice(
  web3: Web3
): Promise<[string | null, TransactionConfig | null]> {
  try {
    const latestBlock = await web3.eth.getBlock('latest', false);

    // eip-1559?
    if (latestBlock.baseFeePerGas) {
      const baseFeeSafetyMultiplier = 1.5; // a lot of full blocks after our estimate could increase the required base fee
      const minPriorityFeePerGas = new BigNumber(1_500_000_000); // 1.5 gwei
      const estimatePriorityFeePerGas = await estimatePriorityGasFee(web3, latestBlock.number);
      const maxPriorityFeePerGas = BigNumber.max(estimatePriorityFeePerGas, minPriorityFeePerGas);

      const baseFeePerGas = new BigNumber(latestBlock.baseFeePerGas)
        .multipliedBy(baseFeeSafetyMultiplier)
        .decimalPlaces(0);

      return [
        null,
        {
          // baseFeePerGas: baseFeePerGas.toString(10),
          maxPriorityFeePerGas: maxPriorityFeePerGas.toString(10),
          maxFeePerGas: baseFeePerGas.plus(maxPriorityFeePerGas).toString(10),
        },
      ];
    }
  } catch (err) {
    console.error('cannot estimate gas price,', err);
    return [`estimateGasPrice: ${getErrorMessage(err)}`, null];
  }

  return [null, {}];
}

// TODO: method type?
export async function estimateGas(web3: Web3, method: any, options: TransactionConfig) {
  const [gasLimitError, gasLimitOptions] = await estimateGasLimit(method, options);
  if (gasLimitError) {
    return [gasLimitError, null];
  }

  const [gasPriceError, gasPriceOptions] = await estimateGasPrice(web3);
  if (gasPriceError) {
    return [gasPriceError, null];
  }

  return [null, { ...options, ...gasLimitOptions, ...gasPriceOptions }];
}
