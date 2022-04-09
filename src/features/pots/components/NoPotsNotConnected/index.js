import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../components/Buttons/PrimaryButton';
import { NoPotsCard } from '../../../../components/NoPotsCard';
import { WalletConnectButton } from '../../../../components/WalletRequired/WalletRequired';

export const NoPotsNotConnected = memo(function NoPotsNotConnected() {
  const { t } = useTranslation();

  return (
    <NoPotsCard
      title={t('noPotsNotConnected.title')}
      text={t('noPotsNotConnected.text', { returnObjects: true })}
      buttons={
        <WalletConnectButton ButtonComponent={PrimaryButton} buttonProps={{ variant: 'purple' }}>
          {t('wallet.connect')}
        </WalletConnectButton>
      }
    />
  );
});
