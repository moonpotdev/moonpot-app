import BigNumber from 'bignumber.js';

export const formatApy = (apy, placeholder = '???') => {
  if (!apy) return placeholder;

  apy *= 100;

  const units = ['', 'k', 'M', 'B', 'T', 'Q', 'Q', 'S', 'S'];
  const order = apy < 1 ? 0 : Math.floor(Math.log10(apy) / 3);
  if (order >= units.length - 1) return `🔥`;

  const num = apy / 1000 ** order;
  return `${num.toFixed(2)}${units[order]}%`;
};

export const formatTvl = (tvl, oraclePrice) => {
  // TODO: bignum?
  if (oraclePrice) {
    tvl *= oraclePrice;
  }

  const order = Math.floor(Math.log10(tvl) / 3);
  if (order < 0) {
    return '$0.00';
  }

  const units = ['', 'k', 'M', 'B', 'T'];
  const num = tvl / 1000 ** order;
  const prefix = '$';

  return prefix + num.toFixed(2) + units[order];
};

export const formatGlobalTvl = tvl => formatTvl(tvl, 1);

export const calcDaily = apy => {
  if (!apy) return `???`;

  const g = Math.pow(10, Math.log10(apy + 1) / 365) - 1;
  if (isNaN(g)) {
    return '- %';
  }

  return `${(g * 100).toFixed(2)}%`;
};

export const stripTrailingZeros = str => {
  return str.replace(/(\.[0-9]*?)(0+$)/, '$1').replace(/\.$/, '');
};

export const formatDecimals = (number, maxPlaces = null, minPlaces = null) => {
  number = BigNumber.isBigNumber(number) ? number.toNumber() : number;

  if (number === 0) {
    return '0';
  }

  const places = maxPlaces === null ? (number >= 10 ? 4 : 8) : maxPlaces;
  return number.toLocaleString(undefined, {
    maximumFractionDigits: places,
    minimumFractionDigits: minPlaces === null ? 0 : minPlaces,
  });
};

export function byDecimals(number, tokenDecimals = 18, truncate = false) {
  const decimals = new BigNumber(10).exponentiatedBy(tokenDecimals);
  const value = new BigNumber(number).dividedBy(decimals);

  if (truncate) {
    return value.decimalPlaces(tokenDecimals, BigNumber.ROUND_DOWN);
  }

  return value;
}

const formatTimeLeftDefaultOptions = {
  resolution: 'minutes',
  dropZero: false,
  fixedWidth: true,
  labels: { days: 'd', hours: 'h', minutes: 'm', seconds: 's' },
};

export const formatTimeLeft = (milliseconds, options) => {
  const { resolution, dropZero, fixedWidth, labels } = {
    ...formatTimeLeftDefaultOptions,
    ...options,
  };
  const order = ['days', 'hours', 'minutes', 'seconds'];
  const wanted = order.slice(0, order.lastIndexOf(resolution) + 1);

  const numbers = {
    days: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
    hours: Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((milliseconds / (1000 * 60)) % 60),
    seconds: Math.floor((milliseconds / 1000) % 60),
  };

  const output = [];

  for (const key of wanted) {
    const number = numbers[key];

    if (number || dropZero === false || output.length > 0) {
      let value = number.toString();
      if (fixedWidth) {
        value = value.padStart(2, '0');
      }
      output.push(value + labels[key]);
    }
  }

  if (output.length === 0) {
    return (fixedWidth ? '00' : '0') + labels[resolution];
  }

  return output.join(' ');
};

export const stripExtraDecimals = (f, decimals = 8) => {
  return f.indexOf('.') >= 0
    ? f.substr(0, f.indexOf('.')) + f.substr(f.indexOf('.'), decimals + 1)
    : f;
};

export function convertAmountToRawNumber(value, decimals = 18) {
  return new BigNumber(value)
    .times(new BigNumber('10').pow(decimals))
    .decimalPlaces(0, BigNumber.ROUND_DOWN)
    .toString(10);
}

export function calculateTotalPrize(item) {
  const a = new BigNumber(item.awardBalanceUsd) ?? 0;
  const s = new BigNumber(item.projectedTotalSponsorBalanceUsd || item.totalSponsorBalanceUsd) ?? 0;
  let total = a.plus(s);

  if (isNaN(total.toFixed(0))) {
    total = BigNumber(0);
  }

  return '$' + total.toFixed(total > 1 ? 0 : 4);
}

export function bigNumberTruncate(number, maxDecimals) {
  const bn = BigNumber.isBigNumber(number) ? number : new BigNumber(number || 0);

  if (bn.isNaN()) {
    return new BigNumber(0);
  }

  return bn.decimalPlaces(maxDecimals, BigNumber.ROUND_DOWN);
}
