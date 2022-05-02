import React, { memo, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { NoPotsCard } from '../../../../components/NoPotsCard';
import { formatAddressShort } from '../../../../helpers/utils';

export type NoDrawsNoWinnersProps = PropsWithChildren<{
  address: string;
}>;
export const NoDrawsNoWinners = memo<NoDrawsNoWinnersProps>(function NoPotsNotConnected({
  address,
}) {
  const { t } = useTranslation();

  return (
    <NoPotsCard
      title={t('noDrawsNoWinners.title')}
      text={t('noDrawsNoWinners.text', {
        returnObjects: true,
        address: formatAddressShort(address),
      })}
    />
  );
});
