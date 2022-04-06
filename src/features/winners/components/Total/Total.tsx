import React, { memo, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { TotalStat } from '../../../../components/TotalStat';
import { Card } from '../../../../components/Cards';
import { useTotalPrizeValue } from '../../apollo/total';
import { RouteLoading } from '../../../../components/RouteLoading';

export type TotalProps = PropsWithChildren<{
  className: string;
}>;

export const Total = memo(function ({ className }: TotalProps) {
  const { t } = useTranslation();
  const { loading, error, total } = useTotalPrizeValue();

  if (loading) {
    return <RouteLoading />;
  }

  if (error) {
    return (
      <Card variant="purpleDark" oneColumn={true}>
        {JSON.stringify(error)}
      </Card>
    );
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
