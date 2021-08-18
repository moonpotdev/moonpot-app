import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { TotalStat } from '../../../../components/TotalStat';
import { Card } from '../../../../components/Cards';
import { useTotalPrizeValue } from '../../apollo/hooks';
import { RouteLoading } from '../../../../components/RouteLoading';

export const Total = memo(function ({ className }) {
  const { t } = useTranslation();
  const { loading, error, total } = useTotalPrizeValue();

  if (loading) {
    return <RouteLoading />;
  }

  if (error) {
    return <Card variant="purpleDark">{JSON.stringify(error)}</Card>;
  }

  const totalFormatted = total.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <TotalStat
      label={t('winners.totalPrizesWon')}
      value={`$${totalFormatted}`}
      className={className}
    />
  );
});
