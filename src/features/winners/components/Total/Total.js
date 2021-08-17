import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TotalStat } from '../../../../components/TotalStat';

export const Total = memo(function ({ className }) {
  const { t } = useTranslation();
  const total = useSelector(state => state.prizeDraws.totalPrizesUsd || 0).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 0,
    }
  );

  return (
    <TotalStat label={t('winners.totalPrizesWon')} value={`$${total}`} className={className} />
  );
});
