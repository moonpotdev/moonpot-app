import { useEffect, useMemo, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { shallowEqual, useSelector } from 'react-redux';
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

export function useTokenBalance(tokenSymbol, tokenDecimals) {
  const balance = useSelector(state => state.balanceReducer.tokens[tokenSymbol]?.balance || 0);

  return useMemo(() => {
    const bn = new BigNumber(balance);

    return byDecimals(bn, tokenDecimals);
  }, [balance, tokenDecimals]);
}

export function useTokenAllowance(spender, tokenSymbol, tokenDecimals) {
  const allowance = useSelector(
    state => state.balanceReducer.tokens[tokenSymbol]?.allowance?.[spender] || 0
  );

  return useMemo(() => {
    if (spender && tokenSymbol && tokenDecimals && allowance) {
      const bn = new BigNumber(allowance);

      return byDecimals(bn, tokenDecimals);
    }

    return new BigNumber(0);
  }, [allowance, spender, tokenSymbol, tokenDecimals]);
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

export function useRewardEarned(potId, rewardToken, rewardTokenDecimals) {
  const address = useSelector(state => state.walletReducer.address);
  const earned = useSelector(state => state.earnedReducer.earned[potId]?.[rewardToken] ?? 0);

  return useMemo(() => {
    if (address && earned && rewardToken && rewardTokenDecimals) {
      return byDecimals(new BigNumber(earned), rewardTokenDecimals);
    }

    return new BigNumber(0);
  }, [earned, rewardToken, rewardTokenDecimals, address]);
}

export function useBonusesEarned(id) {
  const earned = useSelector(state => state.earnedReducer.earned[id], shallowEqual);
  const bonuses = useSelector(state => state.vaultReducer.pools[id]?.bonuses, shallowEqual);
  const prices = useSelector(
    state =>
      Object.fromEntries(
        bonuses.map(bonus => [bonus.id, state.pricesReducer.prices[bonus.oracleId] || 0])
      ),
    shallowEqual
  );

  return useMemo(() => {
    return bonuses.map(bonus => {
      const bonusEarned = byDecimals(earned[bonus.id] || 0, bonus.decimals);
      const price = prices[bonus.id] || 0;

      return {
        ...bonus,
        earned: bonusEarned.toNumber(),
        value: bonusEarned.multipliedBy(price).toNumber(),
      };
    });
  }, [earned, bonuses, prices]);
}
