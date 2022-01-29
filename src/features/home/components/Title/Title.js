import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Translate } from '../../../../components/Translate';

export const Title = memo(function ({ className }) {
  const totalPrizesAvailable = useSelector(
    state => state.vault.projectedTotalPrizesAvailable || state.vault.totalPrizesAvailable
  );
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
