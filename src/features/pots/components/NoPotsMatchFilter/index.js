import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { filterSetConfig } from '../../../filter/slice';
import { FILTER_DEFAULT } from '../../../filter/constants';
import { PrimaryButton } from '../../../../components/Buttons/PrimaryButton';
import { NoPotsCard } from '../NoPotsCard';

export const NoPotsMatchFilter = memo(function NoPotsMatchFilter() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const resetFilterConfig = useCallback(() => {
    dispatch(filterSetConfig(FILTER_DEFAULT));
  }, [dispatch]);

  return (
    <NoPotsCard
      title={t('noPotsMatchFilter.title')}
      text={t('noPotsMatchFilter.text', { returnObjects: true })}
      buttons={
        <PrimaryButton onClick={resetFilterConfig} variant="purple">
          {t('noPotsMatchFilter.reset')}
        </PrimaryButton>
      }
    />
  );
});
