import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { translateToken } from '../../helpers/hooks';
import { listJoin } from '../../helpers/utils';

export function useWinTokens(depositToken, awardBalanceUsd, sponsors, nfts = []) {
  const { t, i18n } = useTranslation();
  const awardsDepositToken = depositToken && awardBalanceUsd.gte(0.01);

  return useMemo(() => {
    const sponsorTokens = sponsors
      .filter(sponsor => sponsor.sponsorBalanceUsd.gte(0.01))
      .map(sponsor => sponsor.sponsorToken);
    const sponsorTokensWithoutDepositToken = sponsorTokens.filter(token => token !== depositToken);
    const tokens = awardsDepositToken
      ? [depositToken, ...sponsorTokensWithoutDepositToken, ...nfts]
      : [...sponsorTokens, ...nfts];
    return tokens.map(symbol => translateToken(symbol, i18n, t));
  }, [awardsDepositToken, depositToken, sponsors, t, i18n, nfts]);
}

export function useWinTokensList(depositToken, awardBalanceUsd, sponsors, nfts = []) {
  const tokens = useWinTokens(depositToken, awardBalanceUsd, sponsors, nfts);
  return useMemo(() => {
    return listJoin(tokens);
  }, [tokens]);
}
