import { useEffect, useMemo, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { byDecimals } from './format';
import { tokensByNetworkAddress } from '../config/tokens';

export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
}

export function useTotalPrize(awardBalanceUsd, totalSponsorBalanceUsd) {
  return useMemo(() => {
    const a = new BigNumber(awardBalanceUsd ?? 0);
    const s = new BigNumber(totalSponsorBalanceUsd ?? 0);
    const total = a.plus(s);
    const dp = total.gt(1) ? 0 : 4;

    return total.toNumber().toLocaleString(undefined, {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp,
    });
  }, [awardBalanceUsd, totalSponsorBalanceUsd]);
}

export function useTokenBalance(token, tokenDecimals) {
  const balance = useSelector(state => state.balanceReducer.tokens[token]?.balance || 0);

  return useMemo(() => {
    const bn = new BigNumber(balance);

    return byDecimals(bn, tokenDecimals);
  }, [balance, tokenDecimals]);
}

export function useTokenAllowance(address, token, tokenDecimals) {
  const allowance = useSelector(
    state => state.balanceReducer.tokens[token]?.allowance[address] || 0
  );

  return useMemo(() => {
    const bn = new BigNumber(allowance);

    return byDecimals(bn, tokenDecimals);
  }, [allowance, tokenDecimals]);
}

export function useTokenEarned(id, token, tokenDecimals) {
  const earned = useSelector(state => state.earnedReducer.earned[id]?.[token] || 0);

  return useMemo(() => {
    const bn = new BigNumber(earned);

    return byDecimals(bn, tokenDecimals);
  }, [earned, tokenDecimals]);
}

export function useTokenAddressPrice(address, network = 'bsc') {
  const tokenData = tokensByNetworkAddress[network]?.[address.toLowerCase()];
  return useSelector(state =>
    tokenData ? state.pricesReducer.prices[tokenData.oracleId] || 0 : 0
  );
}

export function usePot(id) {
  // TODO: replace state instead of update existing objects so we don't have to do this
  const pots = useSelector(state => state.vaultReducer.pools);
  return id in pots ? pots[id] : null;
}
