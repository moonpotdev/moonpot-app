import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TotalStat } from '../../../../components/TotalStat';

export const TVL = memo(function ({ className }) {
  const { t } = useTranslation();
  const tvl = useSelector(state => state.vault.totalTvl || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return <TotalStat label={t('homeTotalDeposits')} value={`$${tvl}`} className={className} />;
});
