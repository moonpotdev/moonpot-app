import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../components/Buttons/PrimaryButton';
import { NoPotsCard } from '../../../../components/NoPotsCard';
import { filteredDrawsActions } from '../../../data/reducers/filtered-draws';
import { useAppDispatch } from '../../../../store';

export const NoDrawsMatchFilter = memo(function NoPotsMatchFilter() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const resetFilterConfig = useCallback(() => {
    dispatch(filteredDrawsActions.reset());
  }, [dispatch]);

  return (
    <NoPotsCard
      title={t('noDrawsMatchFilter.title')}
      text={t('noDrawsMatchFilter.text', { returnObjects: true })}
      buttons={
        <PrimaryButton onClick={resetFilterConfig} variant="purple">
          {t('noDrawsMatchFilter.reset')}
        </PrimaryButton>
      }
    />
  );
});
