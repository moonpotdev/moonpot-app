import React, { memo } from 'react';
import { Alert, AlertText, AlertTitle } from '../Alert';
import { InfoOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

export const DepositsPaused = memo(function DepositsPaused({ reason, variant = 'teal' }) {
  const { t } = useTranslation();
  return (
    <Alert Icon={InfoOutlined} variant={variant}>
      <AlertTitle>{t('deposit.paused.title')}</AlertTitle>
      <AlertText>{reason || t('deposit.paused.defaultReason')}</AlertText>
    </Alert>
  );
});
