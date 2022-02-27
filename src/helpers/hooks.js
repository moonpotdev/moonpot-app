import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { byDecimals, formatDecimals } from './format';
import { tokensByNetworkAddress } from '../config/tokens';
import { useTranslation } from 'react-i18next';
import { ZERO } from './utils';
import { walletAccountsChanged } from '../features/wallet/accountsChanged';
import { selectWalletAddress } from '../features/wallet/selectors';

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
  const balance = useSelector(state => state.balance.tokens[tokenSymbol]?.balance || 0);

  return useMemo(() => {
    const bn = new BigNumber(balance);

    return byDecimals(bn, tokenDecimals);
  }, [balance, tokenDecimals]);
}

export function useTokenAllowance(spender, tokenSymbol, tokenDecimals) {
  const allowance = useSelector(
    state => state.balance.tokens[tokenSymbol]?.allowance?.[spender] || 0
  );

  return useMemo(() => {
    if (spender && tokenSymbol && tokenDecimals && allowance) {
      const bn = new BigNumber(allowance);

      return byDecimals(bn, tokenDecimals);
    }

    return ZERO;
  }, [allowance, spender, tokenSymbol, tokenDecimals]);
}

export function useTokenEarned(id, token, tokenDecimals) {
  const earned = useSelector(state => state.earned.earned[id]?.[token] || 0);

  return useMemo(() => {
    const bn = new BigNumber(earned);

    return byDecimals(bn, tokenDecimals);
  }, [earned, tokenDecimals]);
}

export function useTokenAddressPrice(address, network = 'bsc') {
  const tokenData = tokensByNetworkAddress[network]?.[address.toLowerCase()];
  return useSelector(state =>
    tokenData ? state.prices.byNetworkAddress[tokenData.network][tokenData.address] || 0 : 0
  );
}

export function usePot(id) {
  // TODO: replace state instead of update existing objects so we don't have to do this
  return useSelector(state => state.vault.pools[id]);
}

export function usePots() {
  const pots = useSelector(state => state.vault.pools);
  return pots;
}

export function useRewardEarned(potId, rewardToken, rewardTokenDecimals) {
  const address = useSelector(selectWalletAddress);
  const earned = useSelector(state => state.earned.earned[potId]?.[rewardToken] ?? 0);

  return useMemo(() => {
    if (address && earned && rewardToken && rewardTokenDecimals) {
      return byDecimals(new BigNumber(earned), rewardTokenDecimals);
    }

    return ZERO;
  }, [earned, rewardToken, rewardTokenDecimals, address]);
}

export function useBonusesEarned(id) {
  const earned = useSelector(state => state.earned.earned[id], shallowEqual);
  const bonuses = useSelector(state => state.vault.pools[id]?.bonuses, shallowEqual);
  const prices = useSelector(
    state =>
      Object.fromEntries(
        bonuses.map(bonus => [bonus.id, state.prices.prices[bonus.oracleId] || 0])
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

export function useSymbolOrList(symbols) {
  return useMemo(() => {
    if (symbols && symbols.length) {
      return symbols.join(' / ');
    }

    return '';
  }, [symbols]);
}

export function useSymbolAndList(symbols) {
  return useMemo(() => {
    if (symbols && symbols.length) {
      if (symbols.length <= 2) {
        return symbols.join(' & ');
      }

      return symbols.slice(0, -1).join(', ') + ' & ' + symbols.slice(-1);
    }

    return '';
  }, [symbols]);
}

export function translateToken(symbol, i18n, t) {
  const key = 'tokens.' + symbol;
  if (i18n.exists(key)) {
    return t(key);
  }

  return symbol;
}

export function useTranslatedToken(symbol) {
  const { i18n, t } = useTranslation();

  return useMemo(() => {
    return translateToken(symbol, i18n, t);
  }, [symbol, i18n, t]);
}

export function useImpersonate() {
  const dispatch = useDispatch();

  window.impersonate = useCallback(
    address => {
      dispatch(walletAccountsChanged({ accounts: [address] }));
    },
    [dispatch]
  );
}

export function useDeposit(contractAddress, decimals, format = true) {
  const address = useSelector(selectWalletAddress);
  const balance256 = useSelector(
    state => state.balance.tokens[contractAddress + ':total']?.balance
  );

  return useMemo(() => {
    if (address && balance256) {
      return format
        ? formatDecimals(byDecimals(balance256, decimals), 2)
        : byDecimals(balance256, decimals);
    }

    return 0;
  }, [address, balance256, decimals, format]);
}
