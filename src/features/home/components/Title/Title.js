import React, { memo, useMemo } from 'react';
import { Translate } from '../../../../components/Translate';
import { usePots } from '../../../../helpers/hooks';
import { calculateTotalUsdPrize } from '../../../../helpers/utils';

export const Title = memo(function ({ className }) {
  const pots = usePots();
  const totalPrizesAvailable = calculateTotalUsdPrize({ pots });
  const totalPrizesAvailableFormatted = useMemo(() => {
    return totalPrizesAvailable.toNumber().toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }, [totalPrizesAvailable]);

  return (
    <div className={className}>
      <Translate i18nKey="homeTitle" values={{ amount: totalPrizesAvailableFormatted }} />
    </div>
  );
});
