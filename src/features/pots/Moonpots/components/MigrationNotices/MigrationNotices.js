import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { useTokenBalance } from '../../../../../helpers/hooks';
import { Card, Cards, CardTitle } from '../../../../../components/Cards';
import { PrimaryButton } from '../../../../../components/Buttons/PrimaryButton';
import { useWalletConnected } from '../../../../wallet/hooks';

const useStyles = makeStyles(styles);

function MigrationNotice({ pot }) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const balance = useTokenBalance(pot.contractAddress + ':total', pot.tokenDecimals, pot.network);
  const hasBalance = balance.gt(0);

  if (hasBalance) {
    const title = i18n.exists(`migration.notice.${pot.id}.title`)
      ? `migration.notice.${pot.id}.title`
      : 'migration.notice.all.title';
    const content = i18n.exists(`migration.notice.${pot.id}.content`)
      ? `migration.notice.${pot.id}.content`
      : 'migration.notice.all.content';

    return (
      <Card variant="purpleDark" className={classes.notice} oneColumn={true}>
        <CardTitle>{t(title, { token: pot.token, name: pot.name })}</CardTitle>
        <div className={classes.text}>
          {t(content, { returnObjects: true, token: pot.token, name: pot.name }).map(
            (text, index) => (
              <p key={index}>{text}</p>
            )
          )}
          {pot.migrationLearnMoreUrl ? (
            <p>
              <a
                href={pot.migrationLearnMoreUrl}
                className={classes.link}
                target="_blank"
                rel="noreferrer"
              >
                {t('migration.learnMore')}
              </a>
            </p>
          ) : null}
        </div>
        <PrimaryButton to="/my-moonpots/eol" variant="purple" fullWidth={true}>
          {t('migration.viewRetiredPot', { asset: pot.token })}
        </PrimaryButton>
      </Card>
    );
  }

  return null;
}

export function MigrationNotices() {
  const classes = useStyles();
  const [currentAddress] = useWalletConnected();
  const allPots = useSelector(state => state.vault.pools);

  const potsNeedingMigration = useMemo(() => {
    return Object.values(allPots).filter(pot => pot.status === 'eol' && pot.migrationNeeded);
  }, [allPots]);
  const hasPotsNeedingMigration = potsNeedingMigration.length > 0;

  if (currentAddress && hasPotsNeedingMigration) {
    return (
      <Cards className={classes.notices}>
        {potsNeedingMigration.map(pot => (
          <MigrationNotice key={pot.id} pot={pot} />
        ))}
      </Cards>
    );
  }

  return null;
}
